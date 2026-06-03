import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ExpireBookingCommand } from './expire-booking.command';
import { BookingRepository } from 'src/domain/booking/booking.repository';
import { EventRepository } from 'src/domain/event/event.repository';
import { BOOKING_REPOSITORY } from './create-booking.handler';
import { EVENT_REPOSITORY } from 'src/application/event/commands/create-event.handler';

@Injectable()
export class ExpireBookingHandler {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: BookingRepository,
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: EventRepository,
  ) {}

  async execute(command: ExpireBookingCommand): Promise<void> {
    const booking = await this.bookingRepository.findById(command.bookingId);
    if (!booking) throw new NotFoundException('Booking not found');

    const now = new Date();
    booking.expire(now);

    // Release quota back to ticket category
    const event = await this.eventRepository.findById(booking.eventId);
    if (event) {
      const category = event.getTicketCategories().find(
        (c) => c.id === booking.ticketCategoryId,
      );
      if (category) {
        category.releaseQuota(booking.quantity);
        await this.eventRepository.save(event);
      }
    }

    await this.bookingRepository.save(booking);
  }
}
