let queue = [];
const canvas = document.getElementById('queueCanvas');
const ctx = canvas.getContext('2d');
const queueMaxSize = 9; // Maximum queue size for visualization
let front = -1; // Front pointer
let rear = -1;  // Rear pointer
let isCircular = false; // To track if it’s a circular queue

function init() {
    visualizeQueue();
}

function visualizeQueue() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the queue elements
    for (let i = 0; i < queueMaxSize; i++) {
        if (queue[i] !== undefined) {
            drawElement(i, queue[i]);
        } else {
            drawElement(i, null);
        }
    }

    // Draw front and rear pointers
    if (front !== -1) {
        drawPointer(front, 'f');
    }
    if (rear !== -1) {
        drawPointer(rear, 'r');
    }

    // Update the code display
    document.getElementById('codeDisplay').innerText = isCircular ? getCircularQueueCode() : getEnqueueCode();
}

function drawElement(index, value) {
    const elementWidth = 60;
    const elementHeight = 40;
    const startX = 10 + (index * (elementWidth + 10));
    const startY = 100;

    ctx.fillStyle = value !== null ? '#3498db' : '#bdc3c7';
    ctx.fillRect(startX, startY, elementWidth, elementHeight);

    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (value !== null) {
        ctx.fillText(value, startX + elementWidth / 2, startY + elementHeight / 2);
    }
}

function drawPointer(index, label) {
    const elementWidth = 60;
    const startX = 10+ (index * (elementWidth + 10));
    const startY = 150;

    ctx.fillStyle = label === 'f' ? 'red' : 'green'; // 'f' for front, 'r' for rear
    ctx.fillText(label, startX + elementWidth / 2, startY);
}

function enqueueElement() {
    const inputValue = document.getElementById('inputValue').value || Math.floor(Math.random() * 100);
    
    if (isCircular) {
        // Circular queue logic
        if ((rear + 1) % queueMaxSize === front) {
            alert('Queue is full');
        } else {
            rear = (rear + 1) % queueMaxSize;
            queue[rear] = inputValue;
            if (front === -1) front = 0;
        }
    } else {
        // Linear queue logic
        if (rear === queueMaxSize - 1) {
            alert('Queue is full');
        } else {
            if (front === -1) front = 0; // Set front if this is the first element
            queue[++rear] = inputValue;
        }
    }

    visualizeQueue();
    document.getElementById('inputValue').value = '';
}

function dequeueElement() {
    if (front === -1) {
        alert('Queue Underflow');
    } else {
        queue[front] = undefined;

        if (isCircular) {
            if (front === rear) {
                front = rear = -1; // Reset queue
            } else {
                front = (front + 1) % queueMaxSize;
            }
        } else {
            if (front === rear) {
                front = rear = -1; // Reset queue
            } else {
                front++;
            }
        }
    }

    visualizeQueue();
}

function clearQueue() {
    queue = [];
    front = rear = -1;
    visualizeQueue();
}

function peekElement() {
    if (front !== -1) {
        alert(`The front value is: ${queue[front]}`);
    } else {
        alert('Queue is empty');
    }
}

function isEmpty() {
    alert(front === -1 ? 'The queue is empty' : 'The queue is not empty');
}

function convertToCircular() {
    isCircular = true;
    alert("Queue has been converted to Circular Queue.");
    visualizeQueue();
}

function getEnqueueCode() {
    return `
function enqueueElement() {
    if (rear === queueMaxSize - 1) {
        alert('Queue is full');
    } else {
        if (front === -1) front = 0;
        queue[++rear] = inputValue;
        visualizeQueue();
    }
}`;
}

function getCircularQueueCode() {
    return `
function enqueueElement() {
    if ((rear + 1) % queueMaxSize === front) {
        alert('Queue is full');
    } else {
        rear = (rear + 1) % queueMaxSize;
        queue[rear] = inputValue;
        if (front === -1) front = 0;
        visualizeQueue();
    }
}`;
}
