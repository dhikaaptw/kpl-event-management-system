import { Money } from 'src/domain/shared/money.value-object';

type CreateTicketCategoryProps = {
    id: string;
    name: string;
    price: Money;
    quota: number;
    salesStartDate: Date;
    salesEndDate: Date;
};

export class TicketCategory {
    private constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly price: Money,
        public readonly quota: number,
        public readonly salesStartDate: Date,
        public readonly salesEndDate: Date,
        private active: boolean,
    ) {}

    public static create(props: CreateTicketCategoryProps): TicketCategory {
        if (!props.name || props.name.trim().length === 0) {
            throw new Error("Ticket category name is required");
        }

        if (props.price.amount < 0) {
            throw new Error("Ticket price cannot be < 0");
        }

        if (props.quota <= 0) {
            throw new Error("Ticket quota must be > 0");
        }

        if (props.salesEndDate < props.salesStartDate) {
            throw new Error("Ticket sales end date cannot be earlier than sales start date");
        }

        return new TicketCategory(
            props.id,
            props.name,
            props.price,
            props.quota,
            props.salesStartDate,
            props.salesEndDate,
            true,
        );
    }

    public disable(): void {
        this.active = false;
    }

    public isActive(): boolean {
        return this.active;
    }

    public isAvailableForPurchase(now: Date): boolean {
        return (
            this.active &&
            now >= this.salesStartDate && now <= this.salesEndDate
        );
    }
}