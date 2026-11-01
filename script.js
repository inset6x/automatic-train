const display = document.getElementById('current-value');
const previousOperation = document.getElementById('previous-operation');

let currentValue = '0';
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

function updateDisplay() {
  display.textContent = currentValue;
}

function updatePreviousOperation() {
  if (firstOperand === null) {
    previousOperation.textContent = '';
    return;
  }

  const operatorSymbol = operator ?? '';
  previousOperation.textContent = `${firstOperand} ${operatorSymbol}`;
}

function inputDigit(digit) {
  if (waitingForSecondOperand) {
    currentValue = digit;
    waitingForSecondOperand = false;
  } else {
    currentValue = currentValue === '0' ? digit : currentValue + digit;
  }

  updateDisplay();
}

function inputDecimal() {
  if (waitingForSecondOperand) {
    currentValue = '0.';
    waitingForSecondOperand = false;
    updateDisplay();
    return;
  }

  if (!currentValue.includes('.')) {
    currentValue += '.';
    updateDisplay();
  }
}

function handleOperator(nextOperator) {
  const inputValue = Number(currentValue);

  if (operator && waitingForSecondOperand) {
    operator = nextOperator;
    updatePreviousOperation();
    return;
  }

  if (firstOperand === null) {
    firstOperand = inputValue;
  } else if (operator) {
    const result = calculate(firstOperand, inputValue, operator);
    currentValue = String(result);
    firstOperand = result;
  }

  waitingForSecondOperand = true;
  operator = nextOperator;
  updatePreviousOperation();
}

function calculate(first, second, op) {
  switch (op) {
    case '+':
      return first + second;
    case '-':
      return first - second;
    case '*':
      return first * second;
    case '/':
      return second === 0 ? 'Error' : first / second;
    default:
      return second;
  }
}

function handleEquals() {
  if (operator === null || firstOperand === null) {
    return;
  }

  const inputValue = Number(currentValue);
  const result = calculate(firstOperand, inputValue, operator);

  currentValue = String(result);
  previousOperation.textContent = '';
  firstOperand = null;
  operator = null;
  waitingForSecondOperand = false;

  updateDisplay();
}

function clearAll() {
  currentValue = '0';
  firstOperand = null;
  operator = null;
  waitingForSecondOperand = false;
  previousOperation.textContent = '';
  updateDisplay();
}

function deleteLast() {
  if (waitingForSecondOperand) {
    return;
  }

  currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : '0';
  updateDisplay();
}

function applyPercent() {
  const value = Number(currentValue) / 100;
  currentValue = String(value);
  updateDisplay();
}

function handleButtonClick(event) {
  const button = event.target.closest('button');
  if (!button) return;

  const action = button.dataset.action;
  const value = button.dataset.value;

  if (action === 'clear') {
    clearAll();
    return;
  }

  if (action === 'delete') {
    deleteLast();
    return;
  }

  if (action === 'percent') {
    applyPercent();
    return;
  }

  if (action === 'equals') {
    handleEquals();
    return;
  }

  if (value !== undefined) {
    if (['+', '-', '*', '/'].includes(value)) {
      handleOperator(value);
      return;
    }

    if (value === '.') {
      inputDecimal();
      return;
    }

    inputDigit(value);
  }
}

document.querySelectorAll('.button').forEach((button) => {
  button.addEventListener('click', handleButtonClick);
});

updateDisplay();
