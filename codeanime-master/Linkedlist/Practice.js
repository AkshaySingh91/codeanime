const canvas = document.getElementById('linkedListCanvas');
const ctx = canvas.getContext('2d');
let i = 1, j = 1;
let animationSpeed = 10;  // Adjust this for animation speed

document.getElementById("push").addEventListener("click", function () {
    i = 1;
    j = 1;
    console.log(i + j);
});

class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
        this.i=0;
    }

    insertAtHead(value) {
        const newNode = new Node(value);
        newNode.next = this.head;
        this.head = newNode;
        this.size++;
        this.animateInsertion(newNode);
    }

    // Animation for node insertion
    animateInsertion(newNode) {
        let x = 50;
        let y = 0;
        let targetY = 200;

        // Animate the node dropping down into the list
        const animate = () => {

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // this.draw(); // Redraw existing list
            ctx.beginPath();
            ctx.fillStyle = 'pink';
            ctx.arc(x, y, 20, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#000';
            ctx.textAlign = 'center';
            ctx.font = '20px Arial';
            ctx.fillText(newNode.value, x, y + 5);

            y += animationSpeed;
            if (y < targetY) {
                requestAnimationFrame(animate);
            } else {
                this.render();  // Render complete list when animation finishes
            }
        };
        requestAnimationFrame(animate);
    }

    // Render the entire linked list
    render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.draw();
    }

    // Draws the linked list nodes and connections
    draw() {
        let current = this.head;
        let x = 50;
        let y = 200;
        const nodeRadius = 20;
        const spacing = 100;

        while (current) {
            // Draw node
            ctx.beginPath();
            ctx.fillStyle = 'pink';
            ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Draw node value
            ctx.fillStyle = '#000';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(current.value, x, y + 5);

            // Draw next pointer (arrow)
            if (current.next) {
                ctx.beginPath();
                ctx.moveTo(x + nodeRadius, y);
                ctx.lineTo(x + spacing - nodeRadius, y);
                ctx.stroke();

                // Draw arrowhead
                ctx.beginPath();
                ctx.moveTo(x + spacing - nodeRadius - 10, y - 10);  // Arrowhead start
                ctx.lineTo(x + spacing - nodeRadius, y);
                ctx.lineTo(x + spacing - nodeRadius - 10, y + 10);  // Arrowhead end
                ctx.stroke();
            }

            // Update x position for next node, handle canvas overflow
            if (x > canvas.width - 100) {
                x = 50;  // Reset x for next row
                y += 50;  // Move to next row
            } else {
                x += spacing;  // Move right
            }
            current = current.next;  // Move to the next node in the list
        }
    }

    // Delete node by value
    deleteNode(value) {

        // If list is empty, return

        if (!this.head) return;
        let x=-50;
        let y=200;
        let space =100;
        let currennt=this.head;

        
        if (this.head.value === value) {
            // If head node is to be deleted
            this.head = this.head.next;
            this.render();  // Re-render after deletion
            return;
        }

        let current = this.head;
        let prev = null;

        while (current && current.value !== value) {
            prev = current;
            current = current.next;
        }

        if (current === null) {
            alert("Node not found!");
            return;
        }

        prev.next = current.next;  // Remove the node
        this.size--;
        this.render();  // Re-render after deletion
    }

    // Search for a node by value and highlight it
    searchNode(value) {
        let current = this.head;
        let x = 50;
        let y = 200;
        const nodeRadius = 20;
        const spacing = 100;

        const interval = setInterval(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.draw();  // Draw the list as it is being searched

            if (current) {
                // Highlight the current node
                ctx.beginPath();
                ctx.fillStyle = 'yellow';
                ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = '#000';
                ctx.font = '20px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(current.value, x, y + 5);

                if (current.value === value) {
                    ctx.beginPath();
                    ctx.fillStyle = 'red';
                    ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    ctx.fillStyle = '#000';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText(current.value, x, y + 5);
                    clearInterval(interval);



                    alert("Node found: " + value);
                } else {
                    current = current.next;
                }

                // Move to the next node
                if (x > canvas.width - 100) {
                    x = 50;
                    y += 50;
                } else {
                    x += spacing;
                }
            } else {
                clearInterval(interval);
                alert("Node not found");
            }
        }, 50);  // Speed of searching animation
    }
}

let linkedList = new LinkedList();

// Insert at head function, bound to button click
function insertAtHead() {
    const value = document.getElementById('nodeValue').value;
    if (value) {
        linkedList.insertAtHead(value);
        document.getElementById('nodeValue').value ='';
    } else {
        linkedList.insertAtHead("12");  // Default value if input is empty
        document.getElementById('nodeValue').value = '';
    }
}

// Delete a node
function deleteNode() {
    const value = document.getElementById('nodeValue').value;
    if (value) {
        linkedList.deleteNode(value);
        document.getElementById('nodeValue').value = '';
    } else {
        alert("Please enter a value to delete");
    }
}

// Search a node
function searchNode() {
    const value = document.getElementById('nodeValue').value;
    if (value) {
        linkedList.searchNode(value);
    } else {
        alert("Please enter a value to search");
    }
}
