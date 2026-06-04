import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { DATABASE_POOL } from 'src/infrastructure/config/database.config';
import { EventQueryRepository } from 'src/application/event/queries/get-published-events.handler';
import { EventDto, ParticipantDto, SalesReportDto, TicketCategoryDto } from 'src/application/event/dtos/event.dto';

@Injectable()
export class PgEventQueryRepository implements EventQueryRepository {
  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}

  async findPublishedEvents(filterDate?: Date, filterLocation?: string): Promise<EventDto[]> {
    let query = `
      SELECT e.*, MIN(tc.price_amount) as lowest_price
      FROM events e
      LEFT JOIN ticket_categories tc ON tc.event_id = e.id AND tc.active = true
      WHERE e.status = 'Published'
    `;
    const params: any[] = [];

    if (filterDate) {
      params.push(filterDate);
      query += ` AND DATE(e.start_date) = DATE($${params.length})`;
    }
    if (filterLocation) {
      params.push(`%${filterLocation}%`);
      query += ` AND e.location ILIKE $${params.length}`;
    }

    query += ' GROUP BY e.id ORDER BY e.start_date ASC';

    const res = await this.pool.query(query, params);
    return res.rows.map((r) => ({
      id: r.id,
      organizerId: r.organizer_id,
      name: r.name,
      description: r.description,
      startDate: r.start_date,
      endDate: r.end_date,
      location: r.location,
      maximumCapacity: r.maximum_capacity,
      status: r.status,
      lowestPrice: r.lowest_price ? parseFloat(r.lowest_price) : undefined,
    }));
  }

  async findEventWithDetails(eventId: string): Promise<EventDto | null> {
    const eRes = await this.pool.query('SELECT * FROM events WHERE id=$1', [eventId]);
    if (eRes.rows.length === 0) return null;

    const e = eRes.rows[0];
    const cRes = await this.pool.query(
      'SELECT * FROM ticket_categories WHERE event_id=$1 ORDER BY created_at',
      [eventId],
    );

    const now = new Date();
    const ticketCategories: TicketCategoryDto[] = cRes.rows.map((c) => {
      let availabilityStatus = 'Inactive';
      if (c.active) {
        const salesStart = new Date(c.sales_start_date);
        const salesEnd = new Date(c.sales_end_date);
        if (now < salesStart) availabilityStatus = 'ComingSoon';
        else if (now > salesEnd) availabilityStatus = 'SalesClosed';
        else if (c.remaining_quota <= 0) availabilityStatus = 'SoldOut';
        else availabilityStatus = 'Available';
      }
      return {
        id: c.id, name: c.name,
        priceAmount: parseFloat(c.price_amount), priceCurrency: c.price_currency,
        quota: c.quota, remainingQuota: c.remaining_quota,
        salesStartDate: c.sales_start_date, salesEndDate: c.sales_end_date,
        active: c.active, availabilityStatus,
      };
    });

    return {
      id: e.id, organizerId: e.organizer_id, name: e.name,
      description: e.description, startDate: e.start_date, endDate: e.end_date,
      location: e.location, maximumCapacity: e.maximum_capacity,
      status: e.status, ticketCategories,
    };
  }

  async getSalesReport(eventId: string): Promise<SalesReportDto> {
    const eRes = await this.pool.query('SELECT * FROM events WHERE id=$1', [eventId]);
    const event = eRes.rows[0];

    const categoryStats = await this.pool.query(
      `SELECT tc.id, tc.name, COUNT(t.id) as total_sold
       FROM ticket_categories tc
       LEFT JOIN tickets t ON t.ticket_category_id = tc.id
         AND t.status IN ('Active','CheckedIn')
       WHERE tc.event_id = $1
       GROUP BY tc.id, tc.name`,
      [eventId],
    );

    const bookingStats = await this.pool.query(
      `SELECT status, COUNT(*) as count FROM bookings WHERE event_id=$1 GROUP BY status`,
      [eventId],
    );

    const revenueRes = await this.pool.query(
      `SELECT SUM(total_price_amount) as revenue, total_price_currency as currency
       FROM bookings WHERE event_id=$1 AND status='Paid' GROUP BY total_price_currency`,
      [eventId],
    );

    const statusCount = { pendingPayment: 0, paid: 0, expired: 0, refunded: 0 };
    for (const row of bookingStats.rows) {
      if (row.status === 'PendingPayment') statusCount.pendingPayment = parseInt(row.count);
      if (row.status === 'Paid') statusCount.paid = parseInt(row.count);
      if (row.status === 'Expired') statusCount.expired = parseInt(row.count);
      if (row.status === 'Refunded') statusCount.refunded = parseInt(row.count);
    }

    return {
      eventId, eventName: event?.name ?? '',
      ticketCategorySales: categoryStats.rows.map((r) => ({
        categoryId: r.id, categoryName: r.name, totalSold: parseInt(r.total_sold),
      })),
      bookingCountByStatus: statusCount,
      totalRevenue: revenueRes.rows[0] ? parseFloat(revenueRes.rows[0].revenue) : 0,
      currency: revenueRes.rows[0]?.currency ?? 'IDR',
    };
  }

  async getParticipants(eventId: string): Promise<ParticipantDto[]> {
    const res = await this.pool.query(
      `SELECT b.customer_id, tc.name as category_name, t.ticket_code, t.status
       FROM bookings b
       JOIN tickets t ON t.booking_id = b.id
       JOIN ticket_categories tc ON tc.id = b.ticket_category_id
       WHERE b.event_id=$1 AND b.status='Paid'
       ORDER BY b.created_at`,
      [eventId],
    );

    return res.rows.map((r) => ({
      customerId: r.customer_id,
      customerName: r.customer_id, // Replace with user lookup if users table exists
      ticketCategoryName: r.category_name,
      ticketCode: r.ticket_code,
      checkInStatus: r.status,
    }));
  }
}
