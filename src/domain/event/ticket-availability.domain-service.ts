import { EventAggregate } from './event.aggregate';
import { EventStatus } from './event-status.enum';

export class TicketAvailabilityDomainService {
    ensureTicketIsAvailable(
        event: EventAggregate,
        ticketCategoryId: string,
        quantity: number,
        now: Date,
    ): void {
        if (event.getStatus() !== EventStatus.Published) {
            throw new Error('Event is not published');
        }

        const category = event.getTicketCategories().find(
            (c) => c.id === ticketCategoryId,
        );

        if (!category) {
            throw new Error('Ticket category not found');
        }

        if (!category.isAvailableForPurchase(now)) {
            throw new Error('Ticket category is not available for purchase');
        }

        if (quantity > category.getRemainingQuota()) {
            throw new Error('Not enough remaining quota');
        }
    }
}