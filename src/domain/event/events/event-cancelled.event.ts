import { DomainEvent } from 'src/domain/shared/domain-event.interface';

export class EventCancelledEvent implements DomainEvent {
    public readonly eventName = 'EventCancelled';
    public readonly occurredAt = new Date();

    constructor(public readonly eventId: string) {}
}