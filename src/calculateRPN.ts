// input: 2 3 + 5 ×
// result: 25

import { addOperator, BinaryOperator, getOperator, isOperator, UnaryOperator } from './operator';

type Result = number | string;

export function calculateRPN(input: string): Result {
	const tokens = input.trim().split(' ');
	const stack: number[] = [];

	for (const token of tokens) {
		if (!isOperator(token)) {
			const value = parseInt(token);
			if (isNaN(value)) {
				throw new Error(`Invalid token: '${token}'.`);
			}
			stack.push(value);
		} else {
			const operator = getOperator(token)!;
			operator.execute(stack);
		}
	}
	if (stack.length !== 1) {
		throw new Error('Invalid expression: too many operands remaining.');
	}

	return stack.pop()!;
}
// Basic operators
console.log(calculateRPN('2 3 + 5 *')); // 25
console.log(calculateRPN('3 4 +')); // 7

// Custom unary operator
addOperator(new UnaryOperator('**', (a) => a * a));
console.log(calculateRPN('4 **')); // 16

// Custom binary operator
addOperator(new BinaryOperator('%', (a, b) => a % b));
console.log(calculateRPN('5 3 %')); // 2
