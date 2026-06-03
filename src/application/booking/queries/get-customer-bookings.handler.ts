import { Inject, Injectable } from '@nestjs/common';
import { GetCustomerBookingsQuery } from './get-customer-bookings.query';
import { BookingDto } from '../dtos/booking.dto';

export const BOOKING_QUERY_REPOSITORY = 'BookingQueryRepository';

export abstract class BookingQueryRepository {
  abstract findByCustomerId(customerId: string): Promise<BookingDto[]>;
  abstract findById(id: string): Promise<BookingDto | null>;
}

@Injectable()
export class GetCustomerBookingsHandler {
  constructor(
    @Inject(BOOKING_QUERY_REPOSITORY)
    private readonly bookingQueryRepository: BookingQueryRepository,
  ) {}

  async execute(query: GetCustomerBookingsQuery): Promise<BookingDto[]> {
    return this.bookingQueryRepository.findByCustomerId(query.customerId);
  }
}
