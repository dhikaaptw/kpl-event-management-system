import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { RefundAggregate } from 'src/domain/refund/refund.aggregate';
import { RefundRepository } from 'src/domain/refund/refund.repository';
import { DATABASE_POOL } from 'src/infrastructure/config/database.config';
import { RefundMapper } from '../mappers/refund.mapper';

@Injectable()
export class PgRefundRepository implements RefundRepository {
  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}

  async save(refund: RefundAggregate): Promise<void> {
    await this.pool.query(
      `INSERT INTO refunds (id, booking_id, customer_id, amount_amount, amount_currency,
         refund_deadline, status, rejection_reason, payment_reference, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW())
       ON CONFLICT (id) DO UPDATE SET
         status=$7, rejection_reason=$8, payment_reference=$9, updated_at=NOW()`,
      [
        refund.id, refund.bookingId, refund.customerId,
        refund.amount.amount, refund.amount.currency,
        refund.refundDeadline, refund.getStatus(),
        refund.getRejectionReason(), refund.getPaymentReference(),
      ],
    );
  }

  async findById(id: string): Promise<RefundAggregate | null> {
    const res = await this.pool.query('SELECT * FROM refunds WHERE id=$1', [id]);
    if (res.rows.length === 0) return null;
    return RefundMapper.toDomain(res.rows[0]);
  }

  async findByBookingId(bookingId: string): Promise<RefundAggregate | null> {
    const res = await this.pool.query('SELECT * FROM refunds WHERE booking_id=$1 LIMIT 1', [bookingId]);
    if (res.rows.length === 0) return null;
    return RefundMapper.toDomain(res.rows[0]);
  }
}
