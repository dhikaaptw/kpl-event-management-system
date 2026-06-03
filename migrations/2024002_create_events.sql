CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY,
  organizer_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  location VARCHAR(255) NOT NULL,
  maximum_capacity INT NOT NULL,
  status event_status NOT NULL DEFAULT 'Draft',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
