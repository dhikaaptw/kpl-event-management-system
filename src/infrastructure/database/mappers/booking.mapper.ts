import { BookingAggregate, BookingStatus } from 'src/domain/booking/booking.aggregate';
import { Ticket, TicketStatus } from 'src/domain/booking/ticket.entity';
import { Money } from 'src/domain/shared/money.value-object';

export class BookingMapper {
  static toDomain(bookingRow: any, ticketRows: any[]): BookingAggregate {
    const tickets = ticketRows.map((t) =>
      Ticket.reconstruct({
        id: t.id,
        bookingId: t.booking_id,
        eventId: t.event_id,
        ticketCategoryId: t.ticket_category_id,
        ticketCode: t.ticket_code,
        status: t.status as TicketStatus,
      }),
    );

    return BookingAggregate.reconstruct({
      id: bookingRow.id,
      customerId: bookingRow.customer_id,
      eventId: bookingRow.event_id,
      ticketCategoryId: bookingRow.ticket_category_id,
      quantity: bookingRow.quantity,
      unitPrice: Money.create(parseFloat(bookingRow.unit_price_amount), bookingRow.unit_price_currency),
      totalPrice: Money.create(parseFloat(bookingRow.total_price_amount), bookingRow.total_price_currency),
      paymentDeadline: new Date(bookingRow.payment_deadline),
      status: bookingRow.status as BookingStatus,
      tickets,
    });
  }
}
