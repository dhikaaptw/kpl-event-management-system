import { DomainEvent } from 'src/domain/shared/domain-event.interface';

export class TicketReservedEvent implements DomainEvent {
    public readonly eventName = 'TicketReserved';
    public readonly occurredAt = new Date();

    constructor(
        public readonly bookingId: string,
        public readonly customerId: string,
        public readonly eventId: string,
    ) {}
}