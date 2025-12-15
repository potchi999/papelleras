const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let currentInput = '';
let operator = '';
let firstNumber = '';

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;

        if (button.classList.contains('number')) {
            currentInput += value;
            display.value = currentInput;
        }

        if (button.classList.contains('operator')) {
            if (!firstNumber) {
                firstNumber = currentInput;
                currentInput = '';
                operator = value;
            } else {
                calculate();
                operator = value;
            }
        }

        if (button.classList.contains('equals')) {
            calculate();
            operator = '';
        }

        if (button.classList.contains('clear')) {
            currentInput = '';
            firstNumber = '';
            operator = '';
            display.value = '';
        }
    });
});

function calculate() {
    if (!firstNumber || !operator || !currentInput) return;

    const num1 = parseFloat(firstNumber);
    const num2 = parseFloat(currentInput);
    let result;

    switch (operator) {
        case '+': result = num1 + num2; break;
        case '−': result = num1 - num2; break;
        case '×': result = num1 * num2; break;
        case '÷': result = num1 / num2; break;
        default: return;
    }

    display.value = result;
    firstNumber = result;
    currentInput = '';
}