CREATE TYPE event_status AS ENUM ('Draft', 'Published', 'Cancelled', 'Completed');
CREATE TYPE booking_status AS ENUM ('PendingPayment', 'Paid', 'Expired', 'Refunded');
CREATE TYPE ticket_status AS ENUM ('Active', 'CheckedIn', 'Cancelled');
CREATE TYPE refund_status AS ENUM ('Requested', 'Approved', 'Rejected', 'PaidOut');
