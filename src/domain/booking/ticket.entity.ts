import { TicketCheckedInEvent } from 'src/domain/booking/events/ticket-checked-in.event';
import { DomainEvent } from 'src/domain/shared/domain-event.interface';

export enum TicketStatus {
    Active = 'Active',
    CheckedIn = 'CheckedIn',
    Cancelled = 'Cancelled',
}

type CreateTicketProps = {
    id: string;
    bookingId: string;
    eventId: string;
    ticketCategoryId: string;
    ticketCode: string;
};

type ReconstructTicketProps = {
    id: string;
    bookingId: string;
    eventId: string;
    ticketCategoryId: string;
    ticketCode: string;
    status: TicketStatus;
};

export class Ticket {
    private domainEvents: DomainEvent[] = [];

    private constructor(
        public readonly id: string,
        public readonly bookingId: string,
        public readonly eventId: string,
        public readonly ticketCategoryId: string,
        public readonly ticketCode: string,
        private status: TicketStatus,
    ) {}

    public static create(props: CreateTicketProps): Ticket {
        return new Ticket(
            props.id,
            props.bookingId,
            props.eventId,
            props.ticketCategoryId,
            props.ticketCode,
            TicketStatus.Active,
        );
    }

    public static reconstruct(props: ReconstructTicketProps): Ticket {
        return new Ticket(
            props.id,
            props.bookingId,
            props.eventId,
            props.ticketCategoryId,
            props.ticketCode,
            props.status,
        );
    }

    public checkIn(eventId: string): void {
        if (this.eventId !== eventId) {
            throw new Error('Ticket does not belong to this event');
        }

        if (this.status !== TicketStatus.Active) {
            if (this.status === TicketStatus.CheckedIn) {
                throw new Error('Ticket has already been checked in');
            }
            throw new Error('Ticket is not active');
        }

        this.status = TicketStatus.CheckedIn;

        this.domainEvents.push(
            new TicketCheckedInEvent(this.id, this.bookingId, this.eventId),
        );
    }

    public cancel(): void {
        this.status = TicketStatus.Cancelled;
    }

    public getStatus(): TicketStatus {
        return this.status;
    }

    public isCheckedIn(): boolean {
        return this.status === TicketStatus.CheckedIn;
    }

    public pullDomainEvents(): DomainEvent[] {
        const events = [...this.domainEvents];
        this.domainEvents = [];
        return events;
    }
}
