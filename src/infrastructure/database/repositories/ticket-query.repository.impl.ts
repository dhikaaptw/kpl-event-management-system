import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { DATABASE_POOL } from 'src/infrastructure/config/database.config';
import { TicketQueryRepository } from 'src/application/booking/commands/checkin-ticket.handler';

@Injectable()
export class PgTicketQueryRepository implements TicketQueryRepository {
  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}

  async findBookingByTicketCode(ticketCode: string): Promise<string | null> {
    const res = await this.pool.query(
      'SELECT booking_id FROM tickets WHERE ticket_code=$1 LIMIT 1',
      [ticketCode],
    );
    return res.rows.length > 0 ? res.rows[0].booking_id : null;
  }
}
