import { EventAggregate } from 'src/domain/event/event.aggregate';
import { EventStatus } from 'src/domain/event/event-status.enum';
import { TicketCategory } from 'src/domain/event/ticket-category.entity';
import { Money } from 'src/domain/shared/money.value-object';

export class EventMapper {
  static toDomain(eventRow: any, categoryRows: any[]): EventAggregate {
    const ticketCategories = categoryRows.map((r) =>
      TicketCategory.reconstruct({
        id: r.id,
        name: r.name,
        price: Money.create(parseFloat(r.price_amount), r.price_currency),
        quota: r.quota,
        remainingQuota: r.remaining_quota,
        salesStartDate: new Date(r.sales_start_date),
        salesEndDate: new Date(r.sales_end_date),
        active: r.active,
      }),
    );

    return EventAggregate.reconstruct({
      id: eventRow.id,
      organizerId: eventRow.organizer_id,
      name: eventRow.name,
      description: eventRow.description,
      startDate: new Date(eventRow.start_date),
      endDate: new Date(eventRow.end_date),
      location: eventRow.location,
      maximumCapacity: eventRow.maximum_capacity,
      status: eventRow.status as EventStatus,
      ticketCategories,
    });
  }
}
