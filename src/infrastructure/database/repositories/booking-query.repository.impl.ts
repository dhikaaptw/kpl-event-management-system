import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { DATABASE_POOL } from 'src/infrastructure/config/database.config';
import { BookingQueryRepository } from 'src/application/booking/queries/get-customer-bookings.handler';
import { BookingDto } from 'src/application/booking/dtos/booking.dto';

@Injectable()
export class PgBookingQueryRepository implements BookingQueryRepository {
  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}

  async findByCustomerId(customerId: string): Promise<BookingDto[]> {
    const bRes = await this.pool.query(
      `SELECT * FROM bookings WHERE customer_id=$1 ORDER BY created_at DESC`,
      [customerId],
    );

    const result: BookingDto[] = [];
    for (const b of bRes.rows) {
      const tRes = await this.pool.query('SELECT * FROM tickets WHERE booking_id=$1', [b.id]);
      result.push(this.toDto(b, tRes.rows));
    }
    return result;
  }

  async findById(id: string): Promise<BookingDto | null> {
    const bRes = await this.pool.query('SELECT * FROM bookings WHERE id=$1', [id]);
    if (bRes.rows.length === 0) return null;
    const tRes = await this.pool.query('SELECT * FROM tickets WHERE booking_id=$1', [id]);
    return this.toDto(bRes.rows[0], tRes.rows);
  }

  private toDto(b: any, tickets: any[]): BookingDto {
    return {
      id: b.id,
      customerId: b.customer_id,
      eventId: b.event_id,
      ticketCategoryId: b.ticket_category_id,
      quantity: b.quantity,
      unitPriceAmount: parseFloat(b.unit_price_amount),
      unitPriceCurrency: b.unit_price_currency,
      totalPriceAmount: parseFloat(b.total_price_amount),
      totalPriceCurrency: b.total_price_currency,
      paymentDeadline: b.payment_deadline,
      status: b.status,
      tickets: tickets.map((t) => ({
        id: t.id,
        ticketCode: t.ticket_code,
        status: t.status,
        eventId: t.event_id,
        ticketCategoryId: t.ticket_category_id,
      })),
    };
  }
}
