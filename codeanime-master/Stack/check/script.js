let canvas, ctx;
let stack = [];
const stackHeight = 50;  // Height of each stack element
const initialPosition = { x: 10, y: 10 };  // Initial box position
let animationSpeed = 5;  // Animation speed

function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    drawStack();
}

// Function to draw stack
function drawStack() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas
    for (let i = 0; i < stack.length; i++) {
        drawElement(stack[i], 200, canvas.height - (i + 1) * stackHeight);
    }
}

// Draw stack element on canvas at given coordinates
function drawElement(value, x, y) {
    ctx.fillStyle = '#f1d2f3';
    ctx.fillRect(x, y, 100, stackHeight);  // Draw the rectangle for the stack element
    ctx.strokeStyle = 'black';
    ctx.strokeRect(x, y, 100, stackHeight);
    ctx.fillStyle = 'black';
    ctx.font='15px Arial'
    ctx.fillText(value, x + 40, y + 30);  // Draw the value inside the box
}

// Function to highlight code
function highlightCode(action) {
    document.getElementById('code-push').classList.remove('highlight');
    document.getElementById('code-pop').classList.remove('highlight');
    if (action === 'push') {
        document.getElementById('code-push').classList.add('highlight');
    } else if (action === 'pop') {
        document.getElementById('code-pop').classList.add('highlight');
    }
}

// Function to push element onto stack
function pushElement() {
    const value = document.getElementById('inputValue').value;
    if (value === '') return;
    //highlightCode('push');
    
    // Animate the box moving to stack
    let x = initialPosition.x;
    let y = initialPosition.y;
    
    const interval = setInterval(() => {
        ctx.clearRect(x, y, 100, stackHeight);
        y += animationSpeed;
        if (y >= canvas.height - (stack.length + 1) * stackHeight) {
            clearInterval(interval);
            stack.push(value);
            drawStack();
            document.getElementById('inputValue').value = '';  // Clear input
        } else {
            ctx.fillStyle = 'blue';
            ctx.fillRect(x, y, 100, stackHeight);
        }
    }, 50);
}

// Function to pop element from stack with red flash
function popElement() {
    if (stack.length === 0) return;
    highlightCode('pop');
    
    const elementY = canvas.height - stack.length * stackHeight;
    const value = stack.pop();
    let flash = true;
    
    const interval = setInterval(() => {
        ctx.clearRect(200, elementY, 100, stackHeight);
        ctx.fillStyle = flash ? 'red' : 'blue';
        flash = !flash;
        ctx.fillRect(200, elementY, 100, stackHeight);
        ctx.strokeRect(200, elementY, 100, stackHeight);
        if (!flash) {
            clearInterval(interval);
            drawStack();
        }
    }, 200);
}

function clearStack() {
    stack = [];
    drawStack();
}

function isEmpty() {
    alert(stack.length === 0 ? 'Stack is empty!' : 'Stack is not empty!');
}

function peekElement() {
    if (stack.length > 0) {
        alert('Top element is: ' + stack[stack.length - 1]);
    } else {
        alert('Stack is empty!');
}
}
