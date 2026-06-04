import { RefundAggregate, RefundStatus } from 'src/domain/refund/refund.aggregate';
import { Money } from 'src/domain/shared/money.value-object';

export class RefundMapper {
  static toDomain(row: any): RefundAggregate {
    return RefundAggregate.reconstruct({
      id: row.id,
      bookingId: row.booking_id,
      customerId: row.customer_id,
      amount: Money.create(parseFloat(row.amount_amount), row.amount_currency),
      refundDeadline: new Date(row.refund_deadline),
      status: row.status as RefundStatus,
      rejectionReason: row.rejection_reason ?? null,
      paymentReference: row.payment_reference ?? null,
    });
  }
}
