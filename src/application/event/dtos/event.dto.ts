export class TicketCategoryDto {
  id: string;
  name: string;
  priceAmount: number;
  priceCurrency: string;
  quota: number;
  remainingQuota: number;
  salesStartDate: Date;
  salesEndDate: Date;
  active: boolean;
  availabilityStatus: string; // Available, ComingSoon, SalesClosed, SoldOut, Inactive
}

export class EventDto {
  id: string;
  organizerId: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  maximumCapacity: number;
  status: string;
  lowestPrice?: number;
  ticketCategories?: TicketCategoryDto[];
}

export class SalesReportDto {
  eventId: string;
  eventName: string;
  ticketCategorySales: {
    categoryId: string;
    categoryName: string;
    totalSold: number;
  }[];
  bookingCountByStatus: {
    pendingPayment: number;
    paid: number;
    expired: number;
    refunded: number;
  };
  totalRevenue: number;
  currency: string;
}

export class ParticipantDto {
  customerId: string;
  customerName: string;
  ticketCategoryName: string;
  ticketCode: string;
  checkInStatus: string;
}
