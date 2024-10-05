let steps = [];
let currentStep = -1;
let interval = null;
let speed = 5000; 

function runVisualization() {
    const inputElement = document.getElementById('prefixInput');
    const expression = inputElement.value.trim();
    steps = [];
    currentStep = -1;
    clearInterval(interval); // Stop any running interval before starting a new one
    
    if (!expression) {
        alert("Please enter a prefix expression.");
        return;
    }

    document.getElementById('expression').querySelector('.content').innerHTML = expression;
    document.getElementById('stack').querySelector('.content').innerHTML = '';
    document.getElementById('result').textContent = '';

    parsePrefix(expression.split(/\s+/).reverse()); // Process the prefix expression
    visualizeNextStep(); // Start the visualization
}


function pauseVisualization() {
    if (interval) {
        clearInterval(interval); // Pause
        interval = null;
    } else {
        visualizeNextStep(); // Resume
    }
}


function clearVisualization() {
    if (interval) {
        clearInterval(interval);
    }
    document.getElementById('prefixInput').value = '';
    document.getElementById('expression').querySelector('.content').innerHTML = '';
    document.getElementById('stack').querySelector('.content').innerHTML = '';
    document.getElementById('result').textContent = '';
    steps = [];
    currentStep = -1;
}


function parsePrefix(tokens) {
    const stack = [];
    
    tokens.forEach(token => {
        if (!isNaN(token)) {
            stack.push(parseFloat(token));
            addStep(token, stack.slice(), ""); // Add step for operand
        } else {
            const operand1 = stack.pop();
            const operand2 = stack.pop();
            const result = evaluate(operand1, operand2, token); // Calculate result
            stack.push(result.split('=')[1].trim());
            addStep(token, stack.slice(), `Result: ${result}`); // Add step with result only
        }
    });
    
    const finalResult = stack.pop();
    addStep('', [], `Final Result: ${finalResult}`); // Final step
}

// Function to evaluate the operation
function evaluate(operand1, operand2, operator) {
    switch (operator) {
        case '+': return`${operand1} + ${operand2}= ${operand1 + operand2}` ;
        case '-': return `${operand1} - ${operand2}= ${operand1 - operand2}`;
        case '*': return `${operand1} * ${operand2}= ${operand1 * operand2}`;
        case '/': return `${operand1} / ${operand2}= ${operand1 / operand2}`;
        default: throw new Error(`Unknown operator: ${operator}`);
    }
}


function addStep(symbol, stack, result) {
    steps.push({ symbol, stack, result });
}

function visualizeNextStep() {
    if (currentStep < steps.length - 1) {
        currentStep++;
        const step = steps[currentStep];
        updateVisualization(step);
        interval = setTimeout(visualizeNextStep, speed); // Move to the next step based on the speed
    } else {
        clearInterval(interval); 
    }
}

function updateVisualization(step) {
    const stackElement = document.getElementById('stack').querySelector('.content');
    const resultElement = document.getElementById('result');
    
    stackElement.innerHTML = '';
    step.stack.forEach(item => {
        stackElement.innerHTML = `<div class="stack-enter">${item}</div>` + stackElement.innerHTML; // Display the stack
    });
    
    resultElement.textContent = step.result;
}

// Undo functionality
function undo() {
    if (currentStep > 0) {
        currentStep--;
        updateVisualization(steps[currentStep]);
        clearInterval(interval);
    }
}

// Redo functionality
function redo() {
    if (currentStep < steps.length - 1) {
        currentStep++;
        updateVisualization(steps[currentStep]);
        clearInterval(interval);
    }
}

// Speed control slider
document.getElementById('speedControl').addEventListener('input', function () {
    speed = 5000 - this.value; 
});
