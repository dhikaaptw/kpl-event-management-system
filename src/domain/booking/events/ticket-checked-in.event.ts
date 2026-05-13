import { DomainEvent } from 'src/domain/shared/domain-event.interface';

export class TicketCheckedInEvent implements DomainEvent {
    public readonly eventName = 'TicketCheckedIn';
    public readonly occurredAt = new Date();

    constructor(
        public readonly ticketId: string,
        public readonly bookingId: string,
        public readonly eventId: string,
    ) {}
}
