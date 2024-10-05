let steps = [];
let currentStep = -1;
let speed = 5000;
let isPaused = false; 



var scrollingDiv=document.getElementsByClassName('column');
console.log(scrollingDiv)


// setInterval(() =>{
//     scrollingDiv.scrollTop=scrollingDiv.scrollHeight
// },3000);



function startVisualization() {
    const infixExpression = document.getElementById('infixExpression').value;
    steps = [];
    currentStep = -1;
    document.getElementById('symbolScanned').querySelector('.content').innerHTML = '';
    document.getElementById('stack').querySelector('.content').innerHTML = '';
    document.getElementById('expression').querySelector('.content').innerHTML = '';
    convertToPostfix(infixExpression);
    visualizeNextStep();
}

function refreshPage() {
    location.reload();
}

function convertToPostfix(expression) {
    console.log(expression)
    const stack = [];
    const output = [];
    const precedence = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 };
    const operators = new Set(['+', '-', '*', '/', '^']);

    for (const char of expression) {
        if (/[A-Za-z0-9]/.test(char)) { //regular expression 
            output.push(char);
            addStep(char, stack.slice(), output.join(''));
        } else if (char === '(') {
            stack.push(char);
            addStep(char, stack.slice(), output.join(''));
        } else if (char === ')') {
            while (stack.length && stack[stack.length - 1] !== '(') {
                output.push(stack.pop());
                addStep(char, stack.slice(), output.join(''));
            }
            stack.pop(); // remove '('
            addStep(char, stack.slice(), output.join(''));
        } else if (operators.has(char)) {
            while (stack.length && precedence[stack[stack.length - 1]] >= precedence[char]) {
                output.push(stack.pop());
                addStep(char, stack.slice(), output.join(''));
            }
            stack.push(char);
            addStep(char, stack.slice(), output.join(''));
        }
    }
    while (stack.length) {
        output.push(stack.pop());
        addStep(' ', stack.slice(), output.join(''));
    }
}

function addStep(symbol, stack, expression) {
    steps.push({ symbol, stack, expression });
}

function visualizeNextStep() {
    console.log(steps.length);
    if (currentStep < steps.length - 1) {
        currentStep++;
        const step = steps[currentStep];    //0,1,2...
        updateVisualization(step);
        if(!isPaused)
            setTimeout(visualizeNextStep, speed);
    }
}

function updateVisualization(step) {
    const symbolScanned = document.getElementById('symbolScanned').querySelector('.content');
    const stack = document.getElementById('stack').querySelector('.content');
    const expression = document.getElementById('expression').querySelector('.content');

    symbolScanned.innerHTML += `<div class="row">${step.symbol}</div>`;
    stack.innerHTML = '';
    step.stack.forEach(item => {
        stack.innerHTML = `<div class="stack-enter">${item}</div>` + stack.innerHTML;
    });
    expression.innerHTML += `<div class="row">${step.expression}</div>`;
}

function undo() {
    if (currentStep > 0) {
        currentStep-=1;

        // Remove the last added symbol and expression
        const symbolScanned = document.getElementById('symbolScanned').querySelector('.content');
        const expression = document.getElementById('expression').querySelector('.content');
        
        // Remove the last symbol and last expression row
        const symbolRows = symbolScanned.querySelectorAll('.row');
        const expressionRows = expression.querySelectorAll('.row');
        if (symbolRows.length > 0) {
            symbolScanned.removeChild(symbolRows[symbolRows.length - 1]);
        }
        if (expressionRows.length > 0) {
            expression.removeChild(expressionRows[expressionRows.length - 1]);
        }

        const step = steps[currentStep];

    }
}

function pause() {
    if (!isPaused) {
        // Pause the visualization
        isPaused = true;
 // Change button text to "Play"
    } else {
        // Resume the visualization
        isPaused = false;
 // Change button text to "Pause"
        visualizeNextStep();  // Resume from the current step
    }
}



document.getElementById('speedControl').addEventListener('input', function () {
    speed = 5000 / this.value;
});
