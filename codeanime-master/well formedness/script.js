let steps = [];
let currentStep = -1;
let speed = 1000;
let interval = null;

// Define the matching brackets
const matchingBrackets = {
    ')': '(',
    '}': '{',
    ']': '[',
    '>': '<'
};

// Define opening brackets
const openingBrackets = new Set(['(', '{', '[', '<']);

// Define closing brackets
const closingBrackets = new Set([')', '}', ']', '>']);

function startVisualization() {
    const expression = document.getElementById('expressionInput').value.trim();
    steps = [];
    currentStep = -1;
    document.getElementById('symbolScanned').querySelector('.content').innerHTML = '';
    document.getElementById('stack').querySelector('.content').innerHTML = '';
    document.getElementById('validity').querySelector('.content').innerHTML = '';
    validateExpression(expression);
    visualizeNextStep();
}

function refreshPage() {
    location.reload();
}

function validateExpression(expression) {
    const stack = [];
    for (const char of expression) {
        console.log(expression);
        if (openingBrackets.has(char)) {
            stack.push(char);
            addStep(char, stack.slice(), "Valid");
        } else if (closingBrackets.has(char)) {
            if (stack.length === 0 || stack.pop() !== matchingBrackets[char]) {
                addStep(char, stack.slice(), "Invalid");
                return;
            }
            addStep(char, stack.slice(), "Valid");
        } else {
            addStep(char, stack.slice(), "Valid");
        }
    }

    const isValid = stack.length === 0;
    addStep(' ', stack.slice(), isValid ? "Valid" : "Invalid");
}

function addStep(symbol, stack, validity) {
    steps.push({ symbol, stack, validity });
}

function visualizeNextStep() {
    if (currentStep < steps.length - 1) {
        currentStep++;
        const step = steps[currentStep];
        updateVisualization(step);
        interval = setTimeout(visualizeNextStep, speed);
    } else {
        clearTimeout(interval);
    }
}

function updateVisualization(step) {
    const symbolScanned = document.getElementById('symbolScanned').querySelector('.content');
    const stack = document.getElementById('stack').querySelector('.content');
    const validity = document.getElementById('validity').querySelector('.content');

    symbolScanned.innerHTML += `<div class="row"><div>${step.symbol}</div></div><hr>`;
    stack.innerHTML = '';
    step.stack.forEach(item => {
        stack.innerHTML = `<div class="stack-enter">${item}</div>` + stack.innerHTML;
    });
    validity.innerHTML = `<div class="row"><div>${step.validity}</div></div><hr>`;
}

function pauseVisualization() {
    if (interval) {
        clearTimeout(interval);
        interval = null;
    } else {
        interval = setTimeout(visualizeNextStep, speed);
    }
}

function undo() {
    if (currentStep > 0) {
        currentStep--;
        const step = steps[currentStep];
        updateVisualization(step);
    }
}

function redo() {
    if (currentStep < steps.length - 1) {
        currentStep++;
        const step = steps[currentStep];
        updateVisualization(step);
    }
}

document.getElementById('speedControl').addEventListener('input', function () {

  speed = this.value *1000; // Higher slider value = slower speed
});

