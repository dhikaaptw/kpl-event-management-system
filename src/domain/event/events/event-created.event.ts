import { DomainEvent } from 'src/domain/shared/domain-event.interface';

export class TicketCategoryCreatedEvent implements DomainEvent {
    public readonly eventName = 'TicketCategoryCreated';
    public readonly occurredAt = new Date();

  constructor(
    public readonly eventId: string,
    public readonly ticketCategoryId: string,
  ) {}
}