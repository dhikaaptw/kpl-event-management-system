import { DomainEvent } from 'src/domain/shared/domain-event.interface';

export class TicketCategoryDisabledEvent implements DomainEvent {
    public readonly eventName = 'TicketCategoryDisabled';
    public readonly occurredAt = new Date();

    constructor(
        public readonly eventId: string,
        public readonly ticketCategoryId: string,
    ) {}
}