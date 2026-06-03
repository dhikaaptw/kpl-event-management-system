export interface NotificationService {
  sendBookingConfirmation(customerId: string, bookingId: string): Promise<void>;
  sendTicketCode(customerId: string, ticketCode: string): Promise<void>;
  sendRefundApproved(customerId: string, refundId: string, amount: number): Promise<void>;
  sendRefundRejected(customerId: string, refundId: string, reason: string): Promise<void>;
  sendEventCancelled(customerId: string, eventId: string): Promise<void>;
}

export const NOTIFICATION_SERVICE = Symbol('NotificationService');
