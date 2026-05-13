import { RefundAggregate } from './refund.aggregate';

export interface RefundRepository {
    save(refund: RefundAggregate): Promise<void>;

    findById(id: string): Promise<RefundAggregate | null>;

    findByBookingId(bookingId: string): Promise<RefundAggregate | null>;
}
