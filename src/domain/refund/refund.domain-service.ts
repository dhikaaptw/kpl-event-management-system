import { BookingAggregate, BookingStatus } from '../booking/booking.aggregate';

export class RefundDomainService {
    ensureBookingIsEligibleForRefund(
        booking: BookingAggregate,
        isEventCancelled: boolean,
    ): void {
        if (booking.getStatus() !== BookingStatus.Paid) {
            throw new Error(
                'Refund can only be requested for a paid booking',
            );
        }

        if (booking.hasCheckedInTickets()) {
            throw new Error(
                'Refund cannot be requested if ticket has already been checked in',
            );
        }
    }
}