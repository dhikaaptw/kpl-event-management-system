import { AggregateRoot } from '../shared/aggregate-root';
import { Money } from '../shared/money.value-object';
import { EventStatus } from './event-status.enum';
import { TicketCategory } from './ticket-category.entity';
import { EventCreatedEvent } from './events/event-created.event';
import { EventPublishedEvent } from './events/event-published.event';
import { EventCancelledEvent } from './events/event-cancelled.event';
import { TicketCategoryCreatedEvent } from './events/ticket-category-created.event';
import { TicketCategoryDisabledEvent } from './events/ticket-category-disabled.event';

type CreateEventProps = {
    id: string;
    organizerId: string;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    location: string;
    maximumCapacity: number;
};

type AddTicketCategoryProps = {
    id: string;
    name: string;
    price: Money;
    quota: number;
    salesStartDate: Date;
    salesEndDate: Date;
};

export class EventAggregate extends AggregateRoot {
    private ticketCategories: TicketCategory[] = [];

    private constructor(
    public readonly id: string,
    public readonly organizerId: string,
    public readonly name: string,
    public readonly description: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly location: string,
    public readonly maximumCapacity: number,
    private status: EventStatus,
  ) {
    super();
  }

  public static create(props: CreateEventProps): EventAggregate {
    if (!props.name || props.name.trim().length === 0) {
        throw new Error('Event name is required');
    }

    if (props.endDate < props.startDate) {
        throw new Error('Event end date cannot be earlier than start date');
    }

    if (props.maximumCapacity <= 0) {
        throw new Error('Maximum capacity must be greater than zero');
    }

    const event = new EventAggregate(
        props.id,
        props.organizerId,
        props.name,
        props.description,
        props.startDate,
        props.endDate,
        props.location,
        props.maximumCapacity,
        EventStatus.Draft,
    );

    event.addDomainEvent(new EventCreatedEvent(event.id));

    return event;
  }

  public addTicketCategory(props: AddTicketCategoryProps): void {
    if (props.salesEndDate > this.startDate) {
        throw new Error('Ticket sales period must end before or at event start date');
    }

    const totalQuotaAfterAdded = this.getTotalTicketQuota() + props.quota;

    if (totalQuotaAfterAdded > this.maximumCapacity) {
        throw new Error('Total ticket quota cannot exceed maximum event capacity');
    }

    const ticketCategory = TicketCategory.create(props);

    this.ticketCategories.push(ticketCategory);

    this.addDomainEvent(
        new TicketCategoryCreatedEvent(this.id, ticketCategory.id),
    );
  }

  public publish(): void {
    if (this.status === EventStatus.Cancelled) {
        throw new Error('Cancelled event cannot be published');
    }

    if (this.status !== EventStatus.Draft) {
        throw new Error('Only draft event can be published');
    }

    const activeTicketCategories = this.ticketCategories.filter((category) =>
        category.isActive(),
    );

    if (activeTicketCategories.length === 0) {
        throw new Error('Event must have at least one active ticket category before publishing');
    }

    if (this.getTotalTicketQuota() > this.maximumCapacity) {
        throw new Error('Total ticket quota cannot exceed maximum event capacity');
    }

    this.status = EventStatus.Published;

    this.addDomainEvent(new EventPublishedEvent(this.id));
  }

  public cancel(): void {
    if (this.status === EventStatus.Completed) {
        throw new Error('Completed event cannot be cancelled');
    }

    if (this.status !== EventStatus.Published) {
        throw new Error('Only published event can be cancelled');
    }

    this.status = EventStatus.Cancelled;

    for (const category of this.ticketCategories) {
        category.disable();
    }

    this.addDomainEvent(new EventCancelledEvent(this.id));
  }

  public disableTicketCategory(ticketCategoryId: string): void {
    if (this.status === EventStatus.Completed) {
      throw new Error('Ticket category cannot be disabled when event has been completed');
    }

    const ticketCategory = this.ticketCategories.find(
      (category) => category.id === ticketCategoryId,
    );

    if (!ticketCategory) {
        throw new Error('Ticket category not found');
    }

    ticketCategory.disable();

    this.addDomainEvent(
        new TicketCategoryDisabledEvent(this.id, ticketCategory.id),
    );
  }

  public getStatus(): EventStatus {
    return this.status;
  }

  public getTicketCategories(): TicketCategory[] {
    return [...this.ticketCategories];
  }

  public getActiveTicketCategories(): TicketCategory[] {
    return this.ticketCategories.filter((category) => category.isActive());
  }

  private getTotalTicketQuota(): number {
    return this.ticketCategories.reduce(
        (total, category) => total + category.quota,
        0,
    );
  }
}