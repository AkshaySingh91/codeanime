const canvas = document.getElementById('linkedListCanvas');
const ctx = canvas.getContext('2d');

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
    }

    insertAtHead(value) {
        const newNode = new Node(value);
        newNode.next = this.head;
        this.head = newNode;
        this.size++;
        this.render();
    }

    deleteNode(value) {
        if (!this.head) return;
        
        // If head needs to be deleted
        if (this.head.value === value) {
            this.head = this.head.next;
            this.size--;
            this.render();
            return;
        }

        let current = this.head;
        while (current.next && current.next.value !== value) {
            current = current.next;
        }

        if (current.next) {
            current.next = current.next.next;
            this.size--;
            this.render();
        }
    }

    searchNode(value) {
        let current = this.head;
        let index = 0;

        while (current) {
            if (current.value == value) {
                this.highlightNode(index);
                return;
            }
            current = current.next;
            index++;
        }
        alert('Node not found');
    }

    render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let current = this.head;
        let x = 50;
        let y = 200;
        const nodeRadius = 20;
        const spacing = 70;

        while (current) {
            // Draw node
            animate();

            ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = '#FF5733';
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#000';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(current.value, x - 5, y + 5);

            // Draw next pointer
            if (current.next) {
                ctx.beginPath();
                ctx.moveTo(x + nodeRadius, y);
                ctx.lineTo(x + spacing - nodeRadius, y);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x + spacing - nodeRadius - 10, y - 10); // Arrowhead
                ctx.lineTo(x + spacing - nodeRadius, y);
                ctx.lineTo(x + spacing - nodeRadius - 10, y + 10);
                ctx.stroke();
            }

            x += spacing;
            current = current.next;
        }
    }

    highlightNode(index) {
        let current = this.head;
        let x = 50;
        let y = 200;
        const nodeRadius = 20;
        const spacing = 100;

        for (let i = 0; i < index; i++) {
            current = current.next;
            x += spacing;
        }

        // Highlight the node
        ctx.beginPath();
        ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#28A745'; // Highlight color
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#000';
        ctx.fillText(current.value, x - 5, y + 5);
    }
}

const linkedList = new LinkedList();

// Insert at head
function insertAtHead() {
    const value = document.getElementById('nodeValue').value;
    if (value) {
        linkedList.insertAtHead(value);
        document.getElementById('nodeValue').value = '';
    }
}

// Delete node
function deleteNode() {
    const value = document.getElementById('nodeValue').value;
    if (value) {
        linkedList.deleteNode(value);
        document.getElementById('nodeValue').value = '';
    }
}

// Search node
function searchNode() {
    const value = document.getElementById('nodeValue').value;
    if (value) {
        linkedList.searchNode(value);
    }
}

let n=50;
function animate(){

    requestAnimationFrame(animate);
    ctx.beginPath();
    ctx.arc(40,n+10, 30, 0, Math.PI * 2);
    n+=5;
    if(n==200){
        n=50;
       ctx.clearRect(0,0,100,canvas.width);
    }
}