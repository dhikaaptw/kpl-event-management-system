import { BookingAggregate } from './booking.aggregate';

export interface BookingRepository {
    save(booking: BookingAggregate): Promise<void>;

    findById(id: string): Promise<BookingAggregate | null>;

    findActiveByCustomerAndEvent(
        customerId: string,
        eventId: string,
    ): Promise<BookingAggregate | null>;

    findExpiredPendingBookings(now: Date): Promise<BookingAggregate[]>;
}
