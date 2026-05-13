import { DomainEvent } from 'src/domain/shared/domain-event.interface';

export class BookingExpiredEvent implements DomainEvent {
    public readonly eventName = 'BookingExpired';
    public readonly occurredAt = new Date();

    constructor(
        public readonly bookingId: string,
        public readonly ticketCategoryId: string,
        public readonly quantity: number,
    ) {}
}
