import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CheckInTicketCommand } from './checkin-ticket.command';
import { BookingRepository } from 'src/domain/booking/booking.repository';
import { BOOKING_REPOSITORY } from './create-booking.handler';

export const TICKET_QUERY_REPOSITORY = 'TicketQueryRepository';

export abstract class TicketQueryRepository {
  abstract findBookingByTicketCode(ticketCode: string): Promise<string | null>;
}

@Injectable()
export class CheckInTicketHandler {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: BookingRepository,
    @Inject(TICKET_QUERY_REPOSITORY)
    private readonly ticketQueryRepository: TicketQueryRepository,
  ) {}

  async execute(command: CheckInTicketCommand): Promise<void> {
    const bookingId = await this.ticketQueryRepository.findBookingByTicketCode(
      command.ticketCode,
    );
    if (!bookingId) throw new NotFoundException('Ticket not found');

    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) throw new NotFoundException('Booking not found');

    const ticket = booking.getTickets().find(
      (t) => t.ticketCode === command.ticketCode,
    );
    if (!ticket) throw new NotFoundException('Ticket not found');

    ticket.checkIn(command.eventId);
    await this.bookingRepository.save(booking);
  }
}
