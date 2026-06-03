import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateBookingCommand } from './create-booking.command';
import { BookingAggregate } from 'src/domain/booking/booking.aggregate';
import { BookingRepository } from 'src/domain/booking/booking.repository';
import { EventRepository } from 'src/domain/event/event.repository';
import { BookingDomainService } from 'src/domain/booking/booking.domain-service';
import { TicketAvailabilityDomainService } from 'src/domain/event/ticket-availability.domain-service';
import { EVENT_REPOSITORY } from 'src/application/event/commands/create-event.handler';

export const BOOKING_REPOSITORY = 'BookingRepository';

@Injectable()
export class CreateBookingHandler {
  private readonly ticketAvailabilityService = new TicketAvailabilityDomainService();

  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: BookingRepository,
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: EventRepository,
  ) {}

  async execute(command: CreateBookingCommand): Promise<string> {
    const event = await this.eventRepository.findById(command.eventId);
    if (!event) throw new NotFoundException('Event not found');

    const now = new Date();
    this.ticketAvailabilityService.ensureTicketIsAvailable(
      event,
      command.ticketCategoryId,
      command.quantity,
      now,
    );

    const bookingDomainService = new BookingDomainService(this.bookingRepository);
    await bookingDomainService.ensureCustomerHasNoActiveBooking(
      command.customerId,
      command.eventId,
    );

    const ticketCategory = event.getTicketCategories().find(
      (c) => c.id === command.ticketCategoryId,
    );

    const paymentDeadline = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes

    const booking = BookingAggregate.create({
      id: uuidv4(),
      customerId: command.customerId,
      eventId: command.eventId,
      ticketCategoryId: command.ticketCategoryId,
      quantity: command.quantity,
      unitPrice: ticketCategory!.price,
      paymentDeadline,
    });

    ticketCategory!.reserveQuota(command.quantity);

    await this.eventRepository.save(event);
    await this.bookingRepository.save(booking);

    return booking.id;
  }
}
