import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PayBookingCommand } from './pay-booking.command';
import { BookingRepository } from 'src/domain/booking/booking.repository';
import { Money } from 'src/domain/shared/money.value-object';
import { BOOKING_REPOSITORY } from './create-booking.handler';

function generateTicketCode(): string {
  return `TKT-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

@Injectable()
export class PayBookingHandler {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: BookingRepository,
  ) {}

  async execute(command: PayBookingCommand): Promise<void> {
    const booking = await this.bookingRepository.findById(command.bookingId);
    if (!booking) throw new NotFoundException('Booking not found');

    const paidAmount = Money.create(command.paidAmount, command.currency);
    const now = new Date();

    booking.pay(paidAmount, now, () => uuidv4(), generateTicketCode);
    await this.bookingRepository.save(booking);
  }
}
