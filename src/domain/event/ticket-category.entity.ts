import { Money } from 'src/domain/shared/money.value-object';

type CreateTicketCategoryProps = {
    id: string;
    name: string;
    price: Money;
    quota: number;
    salesStartDate: Date;
    salesEndDate: Date;
};

type ReconstructTicketCategoryProps = {
    id: string;
    name: string;
    price: Money;
    quota: number;
    remainingQuota: number;
    salesStartDate: Date;
    salesEndDate: Date;
    active: boolean;
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
        private remainingQuota: number,
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
            props.quota,
        );
    }

    public static reconstruct(props: ReconstructTicketCategoryProps): TicketCategory {
        return new TicketCategory(
            props.id,
            props.name,
            props.price,
            props.quota,
            props.salesStartDate,
            props.salesEndDate,
            props.active,
            props.remainingQuota,
        );
    }

    public disable(): void {
        this.active = false;
    }

    public isActive(): boolean {
        return this.active;
    }

    public getRemainingQuota(): number {
        return this.remainingQuota;
    }

    public reserveQuota(quantity: number): void {
        if (quantity > this.remainingQuota) {
            throw new Error('Not enough remaining quota');
        }
        this.remainingQuota -= quantity;
    }

    public releaseQuota(quantity: number): void {
        this.remainingQuota += quantity;
    }

    public isAvailableForPurchase(now: Date): boolean {
        return (
            this.active &&
            now >= this.salesStartDate && now <= this.salesEndDate
        );
    }
}