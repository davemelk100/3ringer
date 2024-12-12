import { add, subtract } from './math';

describe('Math functions', () => {
    describe('add', () => {
        it('should add two positive numbers correctly', () => {
            expect(add(2, 3)).toBe(5);
        });

        it('should handle negative numbers', () => {
            expect(add(-1, 1)).toBe(0);
            expect(add(-1, -2)).toBe(-3);
        });
    });

    describe('subtract', () => {
        it('should subtract two positive numbers correctly', () => {
            expect(subtract(5, 3)).toBe(2);
        });

        it('should handle negative numbers', () => {
            expect(subtract(1, -1)).toBe(2);
            expect(subtract(-1, -2)).toBe(1);
        });
    });
}); 