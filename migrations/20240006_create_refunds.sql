CREATE TABLE IF NOT EXISTS refunds (
  id UUID PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES bookings(id),
  customer_id UUID NOT NULL,
  amount_amount NUMERIC(15,2) NOT NULL,
  amount_currency VARCHAR(10) NOT NULL DEFAULT 'IDR',
  refund_deadline TIMESTAMP NOT NULL,
  status refund_status NOT NULL DEFAULT 'Requested',
  rejection_reason TEXT,
  payment_reference VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
