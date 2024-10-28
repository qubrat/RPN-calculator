# Task-Tech

Reverse Polish Notation (RPN) calculator implemented in TypeScript. It supports basic arithmetic operations, custom unary and binary operators, and variadic operators.

## Features

- Basic arithmetic operations (+, -, *, /)
- Custom unary operators (e.g., square)
- Custom binary operators (e.g., modulo)
- Custom variadic operators (e.g., max, min)

## Installation

1. Clone the repository:
`git clone https://github.com/qubrat/RPN-calculator.git` ->
`cd task-tech`

2. Install dependencies:
```npm install```


## Usage

The main function `calculateRPN` is exported from `calculateRPN.ts`. It expects a string containing RPN expression. You can use it like this:

```typescript
import { calculateRPN } from './calculateRPN';

console.log(calculateRPN('2 3 + 5 *')); // 25
console.log(calculateRPN('3 4 +')); // 7
```

## Adding Custom Operators
You can add custom operators using the `addOperator` function:

```typescript
import { addOperator, UnaryOperator, BinaryOperator, VariadicOperator } from './operator';

// Custom unary operator
addOperator(new UnaryOperator('**', (a) => a * a));
console.log(calculateRPN('4 **')); // 16

// Custom binary operator
addOperator(new BinaryOperator('%', (a, b) => a % b));
console.log(calculateRPN('5 3 %')); // 2

// Custom variadic operator
addOperator(new VariadicOperator('avg', (args) => args.reduce((a, b) => a + b, 0) / args.length));
console.log(calculateRPN('2 3 1 avg')); // 2
```

## Testing
Run the tests using Jest:

- `npm test`

