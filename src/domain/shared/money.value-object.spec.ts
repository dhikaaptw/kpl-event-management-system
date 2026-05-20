import { Money } from './money.value-object';

describe('Money', () => {
    describe('create', () => {
        it('should create money with valid amount and currency', () => {
            const money = Money.create(50000, 'IDR');
            expect(money.amount).toBe(50000);
            expect(money.currency).toBe('IDR');
        });

        it('should allow zero amount', () => {
            const money = Money.create(0, 'IDR');
            expect(money.amount).toBe(0);
        });

        it('should throw when amount is negative', () => {
            expect(() => Money.create(-1, 'IDR')).toThrow(
                'Money cannot be negative',
            );
        });

        it('should throw when currency is empty', () => {
            expect(() => Money.create(100, '')).toThrow(
                'Currency is required',
            );
        });
    });

    describe('multiply', () => {
        it('should multiply amount by quantity', () => {
            const money = Money.create(100000, 'IDR');
            const result = money.multiply(3);
            expect(result.amount).toBe(300000);
        });

        it('should throw when quantity is zero', () => {
            const money = Money.create(100000, 'IDR');
            expect(() => money.multiply(0)).toThrow(
                'Quantity must be greater than zero',
            );
        });

        it('should throw when quantity is negative', () => {
            const money = Money.create(100000, 'IDR');
            expect(() => money.multiply(-1)).toThrow(
                'Quantity must be greater than zero',
            );
        });
    });

    describe('add', () => {
        it('should add two money values of same currency', () => {
            const a = Money.create(100000, 'IDR');
            const b = Money.create(50000, 'IDR');
            expect(a.add(b).amount).toBe(150000);
        });

        it('should throw when currencies differ', () => {
            const a = Money.create(100000, 'IDR');
            const b = Money.create(50, 'USD');
            expect(() => a.add(b)).toThrow(
                'Cant add money with different currency',
            );
        });
    });

    describe('equals', () => {
        it('should return true for same amount and currency', () => {
            const a = Money.create(100000, 'IDR');
            const b = Money.create(100000, 'IDR');
            expect(a.equals(b)).toBe(true);
        });

        it('should return false for different amount', () => {
            const a = Money.create(100000, 'IDR');
            const b = Money.create(200000, 'IDR');
            expect(a.equals(b)).toBe(false);
        });

        it('should return false for different currency', () => {
            const a = Money.create(100000, 'IDR');
            const b = Money.create(100000, 'USD');
            expect(a.equals(b)).toBe(false);
        });
    });
});