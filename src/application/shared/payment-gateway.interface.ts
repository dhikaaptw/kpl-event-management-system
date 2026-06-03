export interface PaymentResult {
  success: boolean;
  transactionId: string;
  message: string;
}

export interface PaymentGateway {
  processPayment(
    bookingId: string,
    amount: number,
    currency: string,
  ): Promise<PaymentResult>;
}

export const PAYMENT_GATEWAY = Symbol('PaymentGateway');
