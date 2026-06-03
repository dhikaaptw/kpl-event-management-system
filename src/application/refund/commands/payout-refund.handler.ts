import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PayoutRefundCommand } from './payout-refund.command';
import { RefundRepository } from 'src/domain/refund/refund.repository';
import { REFUND_REPOSITORY } from './request-refund.handler';

@Injectable()
export class PayoutRefundHandler {
  constructor(
    @Inject(REFUND_REPOSITORY)
    private readonly refundRepository: RefundRepository,
  ) {}

  async execute(command: PayoutRefundCommand): Promise<void> {
    const refund = await this.refundRepository.findById(command.refundId);
    if (!refund) throw new NotFoundException('Refund not found');

    refund.markAsPaidOut(command.paymentReference);
    await this.refundRepository.save(refund);
  }
}
