# Event Ticketing & Booking System

Ledwino Galih Wandanu - 5053241017
Handhika Putra Widyartono - 5053241039

Typescript + NestJS

---


## Project Structure

```
kpl-event-management-system/
│
├── migrations/                         
│   ├── 20240001_create_enums.sql
│   ├── 20240002_create_events.sql
│   ├── 20240003_create_ticket_categories.sql
│   ├── 20240004_create_bookings.sql
│   ├── 20240005_create_tickets.sql
│   └── 20240006_create_refunds.sql
│
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   │
│   ├── domain/                         
│   │   ├── shared/
│   │   │   ├── domain-event.ts         
│   │   │   └── errors.ts               
│   │   ├── event/
│   │   │   ├── event.aggregate.ts      
│   │   │   ├── ticket-category.entity.ts
│   │   │   ├── value-objects.ts        
│   │   │   ├── events.ts               
│   │   │   └── event.repository.ts     
│   │   ├── booking/
│   │   │   ├── booking.aggregate.ts
│   │   │   ├── value-objects.ts        
│   │   │   ├── events.ts               
│   │   │   └── booking.repository.ts
│   │   ├── ticket/
│   │   │   ├── ticket.entity.ts
│   │   │   ├── value-objects.ts        
│   │   │   ├── events.ts
│   │   │   └── ticket.repository.ts
│   │   └── refund/
│   │       ├── refund.aggregate.ts
│   │       ├── value-objects.ts        
│   │       ├── events.ts               
│   │       └── refund.repository.ts
│   │
│   ├── application/                    
│   │   ├── ports/
│   │   │   ├── payment-gateway.port.ts 
│   │   │   ├── refund-payment.port.ts  
│   │   │   └── notification.port.ts    
│   │   ├── event/
│   │   │   ├── commands.ts
│   │   │   └── queries.ts
│   │   ├── booking/
│   │   │   ├── commands.ts
│   │   │   └── queries.ts
│   │   ├── ticket/
│   │   │   ├── commands.ts
│   │   │   └── queries.ts
│   │   └── refund/
│   │       ├── commands.ts
│   │       └── queries.ts
│   │
│
```

---

## Implemented User Stories

- US1 – Create Event
- US2 – Publish Event
- US3 – Cancel Event
- US4 – Create Ticket Category
- US5 – Disable Ticket Category
- US6 – View Available Events
- US7 – View Event Details
- US8 – Create Ticket Booking
- US9 – Calculate Booking Total Price
- US10 – Pay Booking
- US11 – Expire Booking
- US12 – View Purchased Tickets
- US13 – Check In Ticket
- US14 – Reject Invalid Ticket Check-in
- US15 – Request Refund
- US16 – Approve Refund
- US17 – Reject Refund
- US18 – Mark Refund as Paid Out
- US19 – View Event Sales Report
- US20 – View Event Participants

---

## Domain Events

| Event | Raised by |
|-------|-----------|
| `EventCreated` | `Event.create()` |
| `EventPublished` | `Event.publish()` |
| `EventCancelled` | `Event.cancel()` |
| `TicketCategoryCreated` | `Event.addCategory()` |
| `TicketCategoryDisabled` | `Event.disableCategory()` |
| `TicketReserved` | `Booking.create()` |
| `BookingPaid` | `Booking.pay()` |
| `BookingExpired` | `Booking.expire()` |
| `TicketCheckedIn` | `Ticket.checkIn()` |
| `RefundRequested` | `Refund.request()` |
| `RefundApproved` | `Refund.approve()` |
| `RefundRejected` | `Refund.reject()` |
| `RefundPaidOut` | `Refund.markPaidOut()` |

---