import { AggregateRoot } from 'src/domain/shared/aggregate-root';
import { Money } from 'src/domain/shared/money.value-object';
import { Ticket, TicketStatus } from 'src/domain/booking/ticket.entity';
import { TicketReservedEvent } from './events/ticket-reserved.event';
import { BookingPaidEvent } from './events/booking-paid.event';
import { BookingExpiredEvent } from './events/booking-expired.event';

export enum BookingStatus {
    PendingPayment = 'PendingPayment',
    Paid = 'Paid',
    Expired = 'Expired',
    Refunded = 'Refunded',
}

type CreateBookingProps = {
    id: string;
    customerId: string;
    eventId: string;
    ticketCategoryId: string;
    quantity: number;
    unitPrice: Money;
    paymentDeadline: Date;
};

type ReconstructBookingProps = {
    id: string;
    customerId: string;
    eventId: string;
    ticketCategoryId: string;
    quantity: number;
    unitPrice: Money;
    totalPrice: Money;
    paymentDeadline: Date;
    status: BookingStatus;
    tickets: Ticket[];
};

export class BookingAggregate extends AggregateRoot {
    private tickets: Ticket[] = [];

    private constructor(
        public readonly id: string,
        public readonly customerId: string,
        public readonly eventId: string,
        public readonly ticketCategoryId: string,
        public readonly quantity: number,
        public readonly unitPrice: Money,
        public readonly totalPrice: Money,
        public readonly paymentDeadline: Date,
        private status: BookingStatus,
    ) {
        super();
    }

    public static create(props: CreateBookingProps): BookingAggregate {
        if (props.quantity <= 0) {
            throw new Error('Ticket quantity must be greater than zero');
        }

        const totalPrice = props.unitPrice.multiply(props.quantity);

        const booking = new BookingAggregate(
            props.id,
            props.customerId,
            props.eventId,
            props.ticketCategoryId,
            props.quantity,
            props.unitPrice,
            totalPrice,
            props.paymentDeadline,
            BookingStatus.PendingPayment,
        );

        booking.addDomainEvent(
            new TicketReservedEvent(booking.id, booking.customerId, booking.eventId),
        );

        return booking;
    }

    public static reconstruct(props: ReconstructBookingProps): BookingAggregate {
        const booking = new BookingAggregate(
            props.id,
            props.customerId,
            props.eventId,
            props.ticketCategoryId,
            props.quantity,
            props.unitPrice,
            props.totalPrice,
            props.paymentDeadline,
            props.status,
        );
        booking.tickets = props.tickets;
        return booking;
    }

    public pay(paidAmount: Money, now: Date, generateTicketId: () => string, generateTicketCode: () => string): void {
        if (this.status !== BookingStatus.PendingPayment) {
            throw new Error('Booking is not in pending payment status');
        }

        if (now > this.paymentDeadline) {
            throw new Error('Payment deadline has passed');
        }

        if (!paidAmount.equals(this.totalPrice)) {
            throw new Error('Payment amount does not match total booking price');
        }

        this.status = BookingStatus.Paid;

        for (let i = 0; i < this.quantity; i++) {
            const ticket = Ticket.create({
                id: generateTicketId(),
                bookingId: this.id,
                eventId: this.eventId,
                ticketCategoryId: this.ticketCategoryId,
                ticketCode: generateTicketCode(),
            });
            this.tickets.push(ticket);
        }

        this.addDomainEvent(
            new BookingPaidEvent(this.id, this.customerId),
        );
    }

    public expire(now: Date): void {
        if (this.status === BookingStatus.Paid) {
            throw new Error('Paid booking cannot be expired');
        }

        if (this.status !== BookingStatus.PendingPayment) {
            throw new Error('Only pending payment booking can be expired');
        }

        if (now <= this.paymentDeadline) {
            throw new Error('Payment deadline has not passed yet');
        }

        this.status = BookingStatus.Expired;

        this.addDomainEvent(
            new BookingExpiredEvent(this.id, this.ticketCategoryId, this.quantity),
        );
    }

    public markAsRefunded(): void {
        if (this.status !== BookingStatus.Paid) {
            throw new Error('Only paid booking can be refunded');
        }
        this.status = BookingStatus.Refunded;
    }

    public hasCheckedInTickets(): boolean {
        return this.tickets.some((ticket) => ticket.isCheckedIn());
    }

    public cancelAllTickets(): void {
        for (const ticket of this.tickets) {
            ticket.cancel();
        }
    }

    public getStatus(): BookingStatus {
        return this.status;
    }

    public getTickets(): Ticket[] {
        return [...this.tickets];
    }

    public override pullDomainEvents() {
        const bookingEvents = super.pullDomainEvents();
        const ticketEvents = this.tickets.flatMap((t) => t.pullDomainEvents());
        return [...bookingEvents, ...ticketEvents];
    }
}
