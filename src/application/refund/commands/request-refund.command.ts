export class RequestRefundCommand {
  constructor(
    public readonly bookingId: string,
    public readonly customerId: string,
    public readonly refundDeadline: Date,
    public readonly isEventCancelled: boolean,
  ) {}
}
