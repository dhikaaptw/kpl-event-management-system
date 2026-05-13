import { DomainEvent } from 'src/domain/shared/domain-event.interface';

export class EventCreatedEvent implements DomainEvent {
    public readonly eventName = 'EventCreated';
    public readonly occurredAt = new Date();

    constructor(public readonly eventId: string) {}
}