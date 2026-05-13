import { DomainEvent } from 'src/domain/shared/domain-event.interface';

export class RefundRequestedEvent implements DomainEvent {
    public readonly eventName = 'RefundRequested';
    public readonly occurredAt = new Date();
    constructor(
        public readonly refundId: string,
        public readonly bookingId: string,
        public readonly customerId: string,
    ) {}
}

export class RefundApprovedEvent implements DomainEvent {
    public readonly eventName = 'RefundApproved';
    public readonly occurredAt = new Date();
    constructor(public readonly refundId: string, public readonly bookingId: string) {}
}

export class RefundRejectedEvent implements DomainEvent {
    public readonly eventName = 'RefundRejected';
    public readonly occurredAt = new Date();
    constructor(
        public readonly refundId: string,
        public readonly bookingId: string,
        public readonly reason: string,
    ) {}
}

export class RefundPaidOutEvent implements DomainEvent {
    public readonly eventName = 'RefundPaidOut';
    public readonly occurredAt = new Date();
    constructor(
        public readonly refundId: string,
        public readonly paymentReference: string,
    ) {}
}
