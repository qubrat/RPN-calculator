import { calculateRPN } from '../calculateRPN';
import { addOperator, UnaryOperator, BinaryOperator, VariadicOperator, resetOperators } from '../operator';

describe('calculateRPN:', () => {
	beforeEach(() => {
		resetOperators();
	});

	it('should evaluate simple expressions', () => {
		expect(calculateRPN('3 4 +')).toBe(7);
		expect(calculateRPN('10 5 -')).toBe(5);
		expect(calculateRPN('2 3 *')).toBe(6);
		expect(calculateRPN('8 4 /')).toBe(2);
	});

	it('should handle unary operators', () => {
		expect(calculateRPN('3 -4 abs +')).toBe(7);
		expect(calculateRPN('-5 abs')).toBe(5);
	});

	it('should handle variadic operators', () => {
		expect(calculateRPN('1 3 2 5 max')).toBe(5);
		expect(calculateRPN('1 3 2 5 min')).toBe(1);
	});

	it('should handle complex expressions', () => {
		expect(calculateRPN('5 1 2 + 4 * + 3 -')).toBe(14);
		expect(calculateRPN('2 3 11 + 5 - *')).toBe(18);
		expect(calculateRPN('2 3 11 + 5 - * abs')).toBe(18);
	});

	it('should throw error for division by zero', () => {
		expect(() => calculateRPN('5 0 /')).toThrow('Division by zero.');
	});

	it('should throw error for invalid tokens', () => {
		expect(() => calculateRPN('3 4 &')).toThrow("Invalid token: '&'.");
	});

	it('should throw error for insufficient operands', () => {
		expect(() => calculateRPN('3 +')).toThrow("Insufficient operands for operator '+'.");
		expect(() => calculateRPN('abs')).toThrow("Insufficient operands for operator 'abs'.");
	});

	it('should throw error for too many operands remaining', () => {
		expect(() => calculateRPN('3 4 5 +')).toThrow('Invalid expression: too many operands remaining.');
	});

	describe('calculateRPN -> adding custom operators:', () => {
		it('should allow adding a new unary operator', () => {
			addOperator(new UnaryOperator('**', (a) => a * a));
			expect(calculateRPN('5 **')).toBe(25);
			expect(calculateRPN('-3 **')).toBe(9);
		});

		it('should allow adding a new binary operator', () => {
			addOperator(new BinaryOperator('%', (a, b) => a % b));
			expect(calculateRPN('10 3 %')).toBe(1);
			expect(calculateRPN('20 7 %')).toBe(6);
		});

		it('should allow adding a new variadic operator', () => {
			addOperator(
				new VariadicOperator('avg', (operands) => {
					const sum = operands.reduce((acc, val) => acc + val, 0);
					return sum / operands.length;
				})
			);
			expect(calculateRPN('1 2 3 4 5 avg')).toBe(3);
			expect(calculateRPN('10 20 30 avg')).toBe(20);
		});

		it('should throw an error when adding an operator with an existing symbol', () => {
			expect(() => addOperator(new BinaryOperator('+', (a, b) => a + b))).toThrow("Operator '+' already exists.");
		});

		it('should throw error for insufficient operands with custom operators', () => {
			addOperator(new UnaryOperator('negate', (a) => -a));
			expect(() => calculateRPN('negate')).toThrow("Insufficient operands for operator 'negate'.");
		});

		it('should correctly handle complex expressions with custom operators', () => {
			addOperator(new UnaryOperator('**', (a) => a * a));
			addOperator(new BinaryOperator('%', (a, b) => a % b));
			addOperator(
				new VariadicOperator('avg', (operands) => {
					const sum = operands.reduce((acc, val) => acc + val, 0);
					return sum / operands.length;
				})
			);
			expect(calculateRPN('3 4 + **')).toBe(49); // (3 + 4) ^ 2 = 7^2 = 49
			expect(calculateRPN('10 3 % 4 *')).toBe(4); // ((10 % 3) * 4) = (1 * 4) = 4
			expect(calculateRPN('5 15 10 avg 2 /')).toBe(5); // ((5+15+10)/3)/2 = (30/3)/2 = 10/2 = 5
		});
	});
});
