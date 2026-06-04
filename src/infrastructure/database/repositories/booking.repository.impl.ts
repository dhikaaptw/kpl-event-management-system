import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { BookingAggregate } from 'src/domain/booking/booking.aggregate';
import { BookingRepository } from 'src/domain/booking/booking.repository';
import { DATABASE_POOL } from 'src/infrastructure/config/database.config';
import { BookingMapper } from '../mappers/booking.mapper';

@Injectable()
export class PgBookingRepository implements BookingRepository {
  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}

  async save(booking: BookingAggregate): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      await client.query(
        `INSERT INTO bookings (id, customer_id, event_id, ticket_category_id, quantity,
           unit_price_amount, unit_price_currency, total_price_amount, total_price_currency,
           payment_deadline, status, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,NOW())
         ON CONFLICT (id) DO UPDATE SET status=$11, updated_at=NOW()`,
        [
          booking.id, booking.customerId, booking.eventId,
          booking.ticketCategoryId, booking.quantity,
          booking.unitPrice.amount, booking.unitPrice.currency,
          booking.totalPrice.amount, booking.totalPrice.currency,
          booking.paymentDeadline, booking.getStatus(),
        ],
      );

      for (const ticket of booking.getTickets()) {
        await client.query(
          `INSERT INTO tickets (id, booking_id, event_id, ticket_category_id, ticket_code, status, updated_at)
           VALUES ($1,$2,$3,$4,$5,$6,NOW())
           ON CONFLICT (id) DO UPDATE SET status=$6, updated_at=NOW()`,
          [
            ticket.id, ticket.bookingId, ticket.eventId,
            ticket.ticketCategoryId, ticket.ticketCode, ticket.getStatus(),
          ],
        );
      }

      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async findById(id: string): Promise<BookingAggregate | null> {
    const bRes = await this.pool.query('SELECT * FROM bookings WHERE id=$1', [id]);
    if (bRes.rows.length === 0) return null;

    const tRes = await this.pool.query('SELECT * FROM tickets WHERE booking_id=$1', [id]);
    return BookingMapper.toDomain(bRes.rows[0], tRes.rows);
  }

  async findActiveByCustomerAndEvent(customerId: string, eventId: string): Promise<BookingAggregate | null> {
    const res = await this.pool.query(
      `SELECT * FROM bookings WHERE customer_id=$1 AND event_id=$2
       AND status IN ('PendingPayment','Paid') LIMIT 1`,
      [customerId, eventId],
    );
    if (res.rows.length === 0) return null;

    const tRes = await this.pool.query('SELECT * FROM tickets WHERE booking_id=$1', [res.rows[0].id]);
    return BookingMapper.toDomain(res.rows[0], tRes.rows);
  }

  async findExpiredPendingBookings(now: Date): Promise<BookingAggregate[]> {
    const res = await this.pool.query(
      `SELECT * FROM bookings WHERE status='PendingPayment' AND payment_deadline < $1`,
      [now],
    );
    const bookings: BookingAggregate[] = [];
    for (const row of res.rows) {
      const tRes = await this.pool.query('SELECT * FROM tickets WHERE booking_id=$1', [row.id]);
      bookings.push(BookingMapper.toDomain(row, tRes.rows));
    }
    return bookings;
  }
}
