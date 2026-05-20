import { BookingRepository } from './booking.repository';

export class BookingDomainService {
    constructor(private readonly bookingRepository: BookingRepository) {}

    async ensureCustomerHasNoActiveBooking(
        customerId: string,
        eventId: string,
    ): Promise<void> {
        const existing = await this.bookingRepository
            .findActiveByCustomerAndEvent(customerId, eventId);

        if (existing) {
            throw new Error(
                'Customer already has an active booking for this event',
            );
        }
    }
}