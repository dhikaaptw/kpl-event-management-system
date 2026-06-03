export class PayBookingCommand {
  constructor(
    public readonly bookingId: string,
    public readonly customerId: string,
    public readonly paidAmount: number,
    public readonly currency: string,
  ) {}
}
