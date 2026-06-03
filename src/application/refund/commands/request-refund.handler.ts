import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { RequestRefundCommand } from './request-refund.command';
import { RefundAggregate } from 'src/domain/refund/refund.aggregate';
import { RefundRepository } from 'src/domain/refund/refund.repository';
import { BookingRepository } from 'src/domain/booking/booking.repository';
import { RefundDomainService } from 'src/domain/refund/refund.domain-service';
import { BOOKING_REPOSITORY } from 'src/application/booking/commands/create-booking.handler';

export const REFUND_REPOSITORY = 'RefundRepository';

@Injectable()
export class RequestRefundHandler {
  private readonly refundDomainService = new RefundDomainService();

  constructor(
    @Inject(REFUND_REPOSITORY)
    private readonly refundRepository: RefundRepository,
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: BookingRepository,
  ) {}

  async execute(command: RequestRefundCommand): Promise<string> {
    const booking = await this.bookingRepository.findById(command.bookingId);
    if (!booking) throw new NotFoundException('Booking not found');

    this.refundDomainService.ensureBookingIsEligibleForRefund(
      booking,
      command.isEventCancelled,
    );

    const now = new Date();
    const refund = RefundAggregate.create(
      {
        id: uuidv4(),
        bookingId: command.bookingId,
        customerId: command.customerId,
        amount: booking['totalPrice'],
        refundDeadline: command.refundDeadline,
      },
      now,
    );

    await this.refundRepository.save(refund);
    return refund.id;
  }
}
