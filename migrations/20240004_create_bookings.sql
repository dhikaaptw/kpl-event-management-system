CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY,
  customer_id UUID NOT NULL,
  event_id UUID NOT NULL REFERENCES events(id),
  ticket_category_id UUID NOT NULL REFERENCES ticket_categories(id),
  quantity INT NOT NULL,
  unit_price_amount NUMERIC(15,2) NOT NULL,
  unit_price_currency VARCHAR(10) NOT NULL DEFAULT 'IDR',
  total_price_amount NUMERIC(15,2) NOT NULL,
  total_price_currency VARCHAR(10) NOT NULL DEFAULT 'IDR',
  payment_deadline TIMESTAMP NOT NULL,
  status booking_status NOT NULL DEFAULT 'PendingPayment',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
