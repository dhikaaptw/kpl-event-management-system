export interface RefundPaymentResult {
  success: boolean;
  paymentReference: string;
  message: string;
}

export interface RefundPaymentService {
  processRefund(
    refundId: string,
    customerId: string,
    amount: number,
    currency: string,
  ): Promise<RefundPaymentResult>;
}

export const REFUND_PAYMENT_SERVICE = Symbol('RefundPaymentService');
