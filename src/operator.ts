// NOTKA:
// Możliwa jest zamiana tego podejścia na podejście z jedną klasą Operator, która będzie miała dodatkowo pole operandCount (liczba argumentów).
// Wówczas metoda operation zawsze przyjmuje tablicę argumentów i na podstawie jej długości oraz wartości pola operandCount będzie sprawdzana poprawność operacji

interface Operator {
	symbol: string;
	execute(stack: number[]): void;
}

class UnaryOperator implements Operator {
	constructor(public symbol: string, private operation: (a: number) => number) {}

	execute(stack: number[]): void {
		if (stack.length < 1) {
			throw new Error(`Insufficient operands for operator '${this.symbol}'.`);
		}
		const a = stack.pop()!;
		const result = this.operation(a);
		stack.push(result);
	}
}

class BinaryOperator implements Operator {
	constructor(public symbol: string, private operation: (a: number, b: number) => number) {}

	execute(stack: number[]): void {
		if (stack.length < 2) {
			throw new Error(`Insufficient operands for operator '${this.symbol}'.`);
		}
		const b = stack.pop()!;
		const a = stack.pop()!;
		const result = this.operation(a, b);
		stack.push(result);
	}
}

class VariadicOperator implements Operator {
	constructor(public symbol: string, private operation: (operands: number[]) => number) {}

	execute(stack: number[]): void {
		if (stack.length < 1) {
			throw new Error(`Insufficient operands for operator '${this.symbol}'.`);
		}
		const result = this.operation([...stack]);
		stack.splice(0, stack.length);
		stack.push(result);
	}
}

const operatorsArray: Operator[] = [];
const operatorsMap = new Map<string, Operator>();
loadDefaultOperators();

function initializeOperatorsMap() {
	operatorsMap.clear();
	for (const operator of operatorsArray) {
		operatorsMap.set(operator.symbol, operator);
	}
}

function loadDefaultOperators() {
	operatorsArray.push(
		new BinaryOperator('+', (a, b) => a + b),
		new BinaryOperator('-', (a, b) => a - b),
		new BinaryOperator('*', (a, b) => a * b),
		new BinaryOperator('/', (a, b) => {
			if (b === 0) {
				throw new Error('Division by zero.');
			}
			return a / b;
		}),
		new UnaryOperator('abs', (a) => Math.abs(a)),
		new VariadicOperator('max', (operands) => Math.max(...operands)),
		new VariadicOperator('min', (operands) => Math.min(...operands))
	);
	initializeOperatorsMap();
}

function clearOperators() {
	operatorsArray.length = 0;
	operatorsMap.clear();
}

function resetOperators() {
	operatorsArray.length = 0;
	operatorsMap.clear();
	loadDefaultOperators();
}

function addOperator(operator: Operator): void {
	if (operatorsMap.has(operator.symbol)) {
		throw new Error(`Operator '${operator.symbol}' already exists.`);
	}
	operatorsArray.push(operator);
	operatorsMap.set(operator.symbol, operator);
	console.log(`Added operator: ${operator.symbol}`);
}

function getOperator(symbol: string): Operator | undefined {
	return operatorsMap.get(symbol);
}

function isOperator(token: string): boolean {
	return operatorsMap.has(token);
}

export { UnaryOperator, BinaryOperator, VariadicOperator, addOperator, getOperator, isOperator, clearOperators, resetOperators };
