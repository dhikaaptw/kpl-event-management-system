import { AggregateRoot } from '../shared/aggregate-root';
import { Money } from '../shared/money.value-object';
import {
    RefundRequestedEvent,
    RefundApprovedEvent,
    RefundRejectedEvent,
    RefundPaidOutEvent,
} from './events/refund.events';

export enum RefundStatus {
    Requested = 'Requested',
    Approved = 'Approved',
    Rejected = 'Rejected',
    PaidOut = 'PaidOut',
}

type CreateRefundProps = {
    id: string;
    bookingId: string;
    customerId: string;
    amount: Money;
    refundDeadline: Date;
};

export class RefundAggregate extends AggregateRoot {
    private constructor(
        public readonly id: string,
        public readonly bookingId: string,
        public readonly customerId: string,
        public readonly amount: Money,
        public readonly refundDeadline: Date,
        private status: RefundStatus,
        private rejectionReason: string | null,
        private paymentReference: string | null,
    ) {
        super();
    }

    public static create(props: CreateRefundProps, now: Date): RefundAggregate {
        if (now > props.refundDeadline) {
            throw new Error('Refund deadline has passed');
        }

        const refund = new RefundAggregate(
            props.id,
            props.bookingId,
            props.customerId,
            props.amount,
            props.refundDeadline,
            RefundStatus.Requested,
            null,
            null,
        );

        refund.addDomainEvent(
            new RefundRequestedEvent(refund.id, refund.bookingId, refund.customerId),
        );

        return refund;
    }

    public approve(): void {
        if (this.status !== RefundStatus.Requested) {
            throw new Error('Refund can only be approved if status is Requested');
        }

        this.status = RefundStatus.Approved;

        this.addDomainEvent(
            new RefundApprovedEvent(this.id, this.bookingId),
        );
    }

    public reject(reason: string): void {
        if (this.status !== RefundStatus.Requested) {
            throw new Error('Refund can only be rejected if status is Requested');
        }

        if (!reason || reason.trim().length === 0) {
            throw new Error('Rejection reason is required');
        }

        this.status = RefundStatus.Rejected;
        this.rejectionReason = reason;

        this.addDomainEvent(
            new RefundRejectedEvent(this.id, this.bookingId, reason),
        );
    }

    public markAsPaidOut(paymentReference: string): void {
        if (this.status !== RefundStatus.Approved) {
            throw new Error('Refund can only be paid out if status is Approved');
        }

        if (!paymentReference || paymentReference.trim().length === 0) {
            throw new Error('Payment reference is required');
        }

        this.status = RefundStatus.PaidOut;
        this.paymentReference = paymentReference;

        this.addDomainEvent(
            new RefundPaidOutEvent(this.id, paymentReference),
        );
    }

    public getStatus(): RefundStatus {
        return this.status;
    }

    public getRejectionReason(): string | null {
        return this.rejectionReason;
    }

    public getPaymentReference(): string | null {
        return this.paymentReference;
    }
}