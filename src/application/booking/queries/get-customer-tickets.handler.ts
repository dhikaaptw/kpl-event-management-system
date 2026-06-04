import { Inject, Injectable } from '@nestjs/common';

export const TICKET_QUERY_REPOSITORY_FOR_CUSTOMER = 'TicketQueryRepositoryForCustomer';

export interface CustomerTicketDto {
  ticketId: string;
  ticketCode: string;
  eventId: string;
  ticketCategoryId: string;
  status: string;
  bookingId: string;
}

export abstract class CustomerTicketQueryRepository {
  abstract findTicketsByCustomerId(customerId: string): Promise<CustomerTicketDto[]>;
}

@Injectable()
export class GetCustomerTicketsHandler {
  constructor(
    @Inject(TICKET_QUERY_REPOSITORY_FOR_CUSTOMER)
    private readonly ticketQueryRepository: CustomerTicketQueryRepository,
  ) {}

  async execute(query: { customerId: string }): Promise<CustomerTicketDto[]> {
    return this.ticketQueryRepository.findTicketsByCustomerId(query.customerId);
  }
}
