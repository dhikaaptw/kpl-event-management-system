import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { EventAggregate } from 'src/domain/event/event.aggregate';
import { EventRepository } from 'src/domain/event/event.repository';
import { DATABASE_POOL } from 'src/infrastructure/config/database.config';
import { EventMapper } from '../mappers/event.mapper';

@Injectable()
export class PgEventRepository implements EventRepository {
  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}

  async save(event: EventAggregate): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      await client.query(
        `INSERT INTO events (id, organizer_id, name, description, start_date, end_date, location, maximum_capacity, status, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW())
         ON CONFLICT (id) DO UPDATE SET
           name=$3, description=$4, start_date=$5, end_date=$6,
           location=$7, maximum_capacity=$8, status=$9, updated_at=NOW()`,
        [
          event.id, event.organizerId, event.name, event.description,
          event.startDate, event.endDate, event.location,
          event.maximumCapacity, event.getStatus(),
        ],
      );

      for (const category of event.getTicketCategories()) {
        await client.query(
          `INSERT INTO ticket_categories (id, event_id, name, price_amount, price_currency, quota, remaining_quota, sales_start_date, sales_end_date, active, updated_at)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW())
           ON CONFLICT (id) DO UPDATE SET
             name=$3, price_amount=$4, price_currency=$5, quota=$6,
             remaining_quota=$7, sales_start_date=$8, sales_end_date=$9, active=$10, updated_at=NOW()`,
          [
            category.id, event.id, category.name,
            category.price.amount, category.price.currency,
            category.quota, category.getRemainingQuota(),
            category.salesStartDate, category.salesEndDate, category.isActive(),
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

  async findById(id: string): Promise<EventAggregate | null> {
    const eventRes = await this.pool.query(
      'SELECT * FROM events WHERE id=$1',
      [id],
    );
    if (eventRes.rows.length === 0) return null;

    const catRes = await this.pool.query(
      'SELECT * FROM ticket_categories WHERE event_id=$1 ORDER BY created_at',
      [id],
    );

    return EventMapper.toDomain(eventRes.rows[0], catRes.rows);
  }
}
