export class Money {
    private constructor(
        public readonly amount: number,
        public readonly currency: string,
    ) {}

    public static rupiah(amount: number): Money {
        return new Money(amount, 'IDR');
    }

    public static create(amount: number, currency: string): Money {
        if (amount < 0 ) {
            throw new Error('Money cannot be negative');
        }

        if (!currency || currency.trim().length === 0) {
            throw new Error('Currency is required');
        }

        return new Money(amount, currency);
    }

    public multiply(quantity: number): Money {
        if (quantity <= 0) {
            throw new Error('Quantity must be greater than zero');
        }

        return new Money(this.amount * quantity, this.currency);
    }

    public add(other: Money): Money {
        if (this.currency !== other.currency) {
            throw new Error('Cant add money with different currency');
        }

        return new Money(this.amount + other.amount, this.currency);
    }

    public equals(other: Money): boolean {
        return this.amount == other.amount && this.currency === other.currency;
    }
}