import { DomainEvent } from 'src/domain/shared/domain-event.interface';

export class BookingPaidEvent implements DomainEvent {
    public readonly eventName = 'BookingPaid';
    public readonly occurredAt = new Date();

    constructor(
        public readonly bookingId: string,
        public readonly customerId: string,
    ) {}
}
