CREATE TABLE IF NOT EXISTS ticket_categories (
  id UUID PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  price_amount NUMERIC(15,2) NOT NULL,
  price_currency VARCHAR(10) NOT NULL DEFAULT 'IDR',
  quota INT NOT NULL,
  remaining_quota INT NOT NULL,
  sales_start_date TIMESTAMP NOT NULL,
  sales_end_date TIMESTAMP NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
