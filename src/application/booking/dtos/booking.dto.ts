export class TicketDto {
  id: string;
  ticketCode: string;
  status: string;
  eventId: string;
  ticketCategoryId: string;
}

export class BookingDto {
  id: string;
  customerId: string;
  eventId: string;
  ticketCategoryId: string;
  quantity: number;
  unitPriceAmount: number;
  unitPriceCurrency: string;
  totalPriceAmount: number;
  totalPriceCurrency: string;
  paymentDeadline: Date;
  status: string;
  tickets: TicketDto[];
}
