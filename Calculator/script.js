// Calculator Variables
let inputDisplay = document.getElementById("inputDisplay");
let resultDisplay = document.getElementById("resultDisplay");
let currentInput = "0";
let previousResult = 0;
let operation = null;
let shouldResetDisplay = false;

// Number Buttons
document.getElementById("num0").addEventListener("click", () => addNumber("0"));
document.getElementById("num1").addEventListener("click", () => addNumber("1"));
document.getElementById("num2").addEventListener("click", () => addNumber("2"));
document.getElementById("num3").addEventListener("click", () => addNumber("3"));
document.getElementById("num4").addEventListener("click", () => addNumber("4"));
document.getElementById("num5").addEventListener("click", () => addNumber("5"));
document.getElementById("num6").addEventListener("click", () => addNumber("6"));
document.getElementById("num7").addEventListener("click", () => addNumber("7"));
document.getElementById("num8").addEventListener("click", () => addNumber("8"));
document.getElementById("num9").addEventListener("click", () => addNumber("9"));
document.getElementById("decimal").addEventListener("click", addDecimal);

// Operator Buttons
document
  .getElementById("plus")
  .addEventListener("click", () => handleOperator("+"));
document
  .getElementById("minus")
  .addEventListener("click", () => handleOperator("-"));
document
  .getElementById("multiply")
  .addEventListener("click", () => handleOperator("*"));
document
  .getElementById("divide")
  .addEventListener("click", () => handleOperator("/"));
document.getElementById("percent").addEventListener("click", calculatePercent);
document.getElementById("sqrt").addEventListener("click", calculateSquareRoot);
document.getElementById("power").addEventListener("click", toggleSign);

// Function Buttons
document
  .getElementById("openParen")
  .addEventListener("click", () => addNumber("("));
document
  .getElementById("closeParen")
  .addEventListener("click", () => addNumber(")"));
document.getElementById("clearBtn").addEventListener("click", clearDisplay);
document.getElementById("delBtn").addEventListener("click", deleteLastChar);
document.getElementById("ansBtn").addEventListener("click", showAnswer);
document.getElementById("enterBtn").addEventListener("click", calculateResult);

// Keyboard Support
document.addEventListener("keydown", handleKeyboardInput);

/**
 * Add a number or symbol to the input
 */
function addNumber(num) {
  if (shouldResetDisplay) {
    currentInput = "";
    shouldResetDisplay = false;
  }

  if (currentInput === "0" && num !== "." && num !== "(" && num !== ")") {
    currentInput = num;
  } else if (num === ".") {
    if (!currentInput.includes(".")) {
      currentInput += num;
    }
  } else {
    currentInput += num;
  }

  updateDisplay();
}

/**
 * Add decimal point
 */
function addDecimal() {
  if (shouldResetDisplay) {
    currentInput = "0";
    shouldResetDisplay = false;
  }

  if (!currentInput.includes(".")) {
    currentInput += ".";
  }

  updateDisplay();
}

/**
 * Handle operator button press
 */
function handleOperator(op) {
  if (currentInput === "") return;

  if (previousResult === 0 && currentInput !== "") {
    previousResult = parseFloat(currentInput);
  } else if (operation !== null && currentInput !== "") {
    previousResult = evaluateExpression(
      previousResult,
      currentInput,
      operation,
    );
    currentInput = previousResult.toString();
  }

  operation = op;
  currentInput = "";
  shouldResetDisplay = true;
  updateDisplay();
}

/**
 * Calculate the result
 */
function calculateResult() {
  if (currentInput === "" || operation === null) return;

  const result = evaluateExpression(previousResult, currentInput, operation);
  previousResult = result;
  currentInput = result.toString();
  operation = null;
  shouldResetDisplay = true;
  updateDisplay();
}

/**
 * Evaluate mathematical expression
 */
function evaluateExpression(prev, curr, op) {
  const prevNum = parseFloat(prev);
  const currNum = parseFloat(curr);

  if (isNaN(prevNum) || isNaN(currNum)) return 0;

  switch (op) {
    case "+":
      return prevNum + currNum;
    case "-":
      return prevNum - currNum;
    case "*":
      return prevNum * currNum;
    case "/":
      if (currNum === 0) {
        showError("Cannot divide by zero");
        return 0;
      }
      return prevNum / currNum;
    default:
      return currNum;
  }
}

/**
 * Calculate percentage
 */
function calculatePercent() {
  if (currentInput === "") return;

  const value = parseFloat(currentInput);
  if (isNaN(value)) return;

  const percentValue = value / 100;
  currentInput = percentValue.toString();
  updateDisplay();
}

/**
 * Calculate square root
 */
function calculateSquareRoot() {
  if (currentInput === "") return;

  const value = parseFloat(currentInput);
  if (isNaN(value)) return;

  if (value < 0) {
    showError("Cannot calculate square root of negative number");
    return;
  }

  const sqrtValue = Math.sqrt(value);
  currentInput = sqrtValue.toString();
  updateDisplay();
}

/**
 * Toggle sign (positive/negative)
 */
function toggleSign() {
  if (currentInput === "" || currentInput === "0") return;

  const value = parseFloat(currentInput);
  currentInput = (-value).toString();
  updateDisplay();
}

/**
 * Delete last character
 */
function deleteLastChar() {
  if (currentInput === "") return;

  currentInput = currentInput.slice(0, -1);
  if (currentInput === "") {
    currentInput = "0";
  }

  updateDisplay();
}

/**
 * Clear the display
 */
function clearDisplay() {
  currentInput = "0";
  previousResult = 0;
  operation = null;
  shouldResetDisplay = false;
  updateDisplay();
}

/**
 * Show the answer (previous result)
 */
function showAnswer() {
  if (previousResult !== 0) {
    currentInput = previousResult.toString();
    updateDisplay();
  }
}

/**
 * Update the display
 */
function updateDisplay() {
  // Update input display
  if (currentInput === "") {
    inputDisplay.textContent = operation ? operation : "";
  } else {
    inputDisplay.textContent = currentInput;
  }

  // Update result display
  if (currentInput === "") {
    resultDisplay.textContent = previousResult !== 0 ? previousResult : "0";
  } else {
    resultDisplay.textContent = currentInput;
  }
}

/**
 * Show error message
 */
function showError(message) {
  resultDisplay.textContent = message;
  setTimeout(() => {
    resultDisplay.textContent = currentInput;
  }, 2000);
}

/**
 * Handle keyboard input
 */
function handleKeyboardInput(event) {
  const key = event.key;

  if (key >= "0" && key <= "9") {
    addNumber(key);
  } else if (key === ".") {
    addDecimal();
  } else if (key === "+" || key === "-") {
    handleOperator(key);
  } else if (key === "*") {
    event.preventDefault();
    handleOperator("*");
  } else if (key === "/") {
    event.preventDefault();
    handleOperator("/");
  } else if (key === "Enter") {
    event.preventDefault();
    calculateResult();
  } else if (key === "Backspace") {
    event.preventDefault();
    deleteLastChar();
  } else if (key === "Escape") {
    clearDisplay();
  } else if (key === "(" || key === ")") {
    addNumber(key);
  }
}

// Initialize display
updateDisplay();
