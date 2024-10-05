let stack = [];
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const stackMaxSize = 11; // Maximum stack size for visualization
let animationSpeed = 5;

document.getElementById('inputValue').addEventListener('keydown',function(e){
    if(e.key==="Enter"){
        var index=stack.length;
        pushElement();

    }
});



function init() {
    // Initial setup, draw an empty stack
    visualizeStack();
}

function visualizeStack() {
    ctx.fillStyle='#f2f5f1';
    ctx.fillRect(0,0, canvas.width, canvas.height);

    
    // Draw the stack elements
    for (let i = 0; i < stack.length; i++) {
        drawElement(i, stack[i]);
    }

    // Draw empty slots
    for (let i = stack.length; i < stackMaxSize; i++) {
        drawElement(i, null);
    }

    // Draw the top pointer
    if (stack.length > 0) {
        drawTopPointer(stack.length - 1);
    }
}

function drawElement(index, value) {
    const elementWidth = 60;
    const elementHeight = 40;
    var startX = 100 + (index * (elementWidth +10));
    var startY = 260;
    if(index==13){
        index-=13;
        
    }

    ctx.fillStyle = value !== null ? '#3498db' : '#bdc3c7';
    ctx.fillRect(startX, startY, elementWidth, elementHeight);


    ctx.fillStyle = '#21212f';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (value !== null) {
        ctx.fillText(value, startX + elementWidth / 2, startY + elementHeight / 2);
    }

    // Draw the index below each element
    ctx.fillStyle = '#2c3e50';
    ctx.fillText(index, startX + elementWidth / 2, startY + elementHeight + 20);
}

function drawTopPointer(index) {
    const elementWidth = 60;
    const startX = 100 + (index * (elementWidth + 10));
    const startY = 200;

    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(startX, startY, elementWidth, 30);
    ctx.fillRect(startX+26, startY+20, 10, 40);

    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('top', startX + elementWidth / 2, startY + 15);
}

function pushElement() {
    if (stack.length < stackMaxSize) {
        var inputValue = document.getElementById('inputValue').value;
        console.log(inputValue);
        var element=0;
        if(inputValue){
            element=inputValue;
        }
        else{
             element = Math.floor(Math.random() * 100);
        }

        
        stack.push(element);
        visualizeStack();
        document.getElementById('inputValue').value='';
    } else {
        alert('Stack is full...')
    }
}

function popElement() {
    if (stack.length > 0) {
        stack.pop();
        visualizeStack();
    } else {
        alert('Stack Underflow');
    }
}

function clearStack() {
    stack = [];
    visualizeStack();
}

function pauseAnimation() {
    // Implement pause functionality if needed
}

function stepBack() {
    // Implement step back functionality if needed
}

function stepForward() {
    // Implement step forward functionality if needed
}

function peekElement(){
    alert(`The topmost value is : ${stack[stack.length-1]}`);
}

function isEmpty(){
    if(stack.length===0)
        alert('The stack is empty');
    else
        alert('The stack is not empty');

}