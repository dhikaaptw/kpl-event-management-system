import { DomainEvent } from 'src/domain/shared/domain-event.interface';

export class EventPublishedEvent implements DomainEvent {
    public readonly eventName = 'EventPublished';
    public readonly occurredAt = new Date();

  constructor(public readonly eventId: string) {}
}