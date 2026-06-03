import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RejectRefundCommand } from './reject-refund.command';
import { RefundRepository } from 'src/domain/refund/refund.repository';
import { REFUND_REPOSITORY } from './request-refund.handler';

@Injectable()
export class RejectRefundHandler {
  constructor(
    @Inject(REFUND_REPOSITORY)
    private readonly refundRepository: RefundRepository,
  ) {}

  async execute(command: RejectRefundCommand): Promise<void> {
    const refund = await this.refundRepository.findById(command.refundId);
    if (!refund) throw new NotFoundException('Refund not found');

    refund.reject(command.reason);
    await this.refundRepository.save(refund);
  }
}
