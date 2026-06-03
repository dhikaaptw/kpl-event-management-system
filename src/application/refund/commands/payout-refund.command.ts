export class PayoutRefundCommand {
  constructor(
    public readonly refundId: string,
    public readonly paymentReference: string,
  ) {}
}
