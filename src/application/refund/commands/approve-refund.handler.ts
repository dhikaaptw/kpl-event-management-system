import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ApproveRefundCommand } from './approve-refund.command';
import { RefundRepository } from 'src/domain/refund/refund.repository';
import { BookingRepository } from 'src/domain/booking/booking.repository';
import { REFUND_REPOSITORY } from './request-refund.handler';
import { BOOKING_REPOSITORY } from 'src/application/booking/commands/create-booking.handler';

@Injectable()
export class ApproveRefundHandler {
  constructor(
    @Inject(REFUND_REPOSITORY)
    private readonly refundRepository: RefundRepository,
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: BookingRepository,
  ) {}

  async execute(command: ApproveRefundCommand): Promise<void> {
    const refund = await this.refundRepository.findById(command.refundId);
    if (!refund) throw new NotFoundException('Refund not found');

    refund.approve();

    const booking = await this.bookingRepository.findById(refund.bookingId);
    if (booking) {
      booking.cancelAllTickets();
      booking.markAsRefunded();
      await this.bookingRepository.save(booking);
    }

    await this.refundRepository.save(refund);
  }
}
