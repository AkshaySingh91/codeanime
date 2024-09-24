import React from 'react';

class TreeNode {
    constructor(id, children = []) {
        this.id = id;
        this.children = children;
        this.x = 0;
        this.y = 0;
        this.mod = 0;
    }

    isLeftMost() {
        return !this.getPreviousSibling();
    }

    getPreviousSibling() {
        const parent = this.getParent();
        if (!parent) return null;
        const index = parent.children.indexOf(this);
        return index > 0 ? parent.children[index - 1] : null;
    }

    getParent() {
        // Assume you have some way of retrieving the parent node
        // This could be a method in your tree structure
        return null; // Placeholder for actual implementation
    }
}

const calculateInitialX = (node, depth = 0) => {
    node.children.forEach(child => calculateInitialX(child, depth + 1));

    node.y = depth; // Set y position based on depth

    if (!node.isLeftMost()) {
        node.x = node.getPreviousSibling().x + 1;
    } else {
        node.x = 0;
    }
};

const positionNodesUnderParent = (node) => {
    node.children.forEach(child => positionNodesUnderParent(child));

    if (node.children.length > 0) {
        const firstChildX = node.children[0].x;
        const lastChildX = node.children[node.children.length - 1].x;
        const middleX = (firstChildX + lastChildX) / 2;

        if (node.isLeftMost()) {
            node.x = middleX;
        } else {
            node.mod = node.x - middleX;
        }
    }
};

const checkNodeConflicts = (node) => {
    if (!node.children.length) return;

    const leftContour = getLeftContour(node);
    const rightContour = node.getPreviousSibling() ? getRightContour(node.getPreviousSibling()) : [];

    let shiftValue = 0;
    for (let y = 0; y < leftContour.length && y < rightContour.length; y++) {
        const distance = rightContour[y] - leftContour[y];
        if (distance >= 0) {
            shiftValue = Math.max(shiftValue, distance + 1);
        }
    }

    if (shiftValue > 0) {
        node.x += shiftValue;
        node.mod += shiftValue;
    }

    node.children.forEach(child => checkNodeConflicts(child));
};

const calculateFinalX = (node, modSum = 0) => {
    node.x += modSum;
    modSum += node.mod;

    node.children.forEach(child => calculateFinalX(child, modSum));
};

const adjustTreeToView = (node) => {
    const minX = findMinX(node);
    if (minX < 0) {
        shiftTree(node, -minX);
    }
};

const findMinX = (node) => {
    let minX = node.x;
    node.children.forEach(child => {
        minX = Math.min(minX, findMinX(child));
    });
    return minX;
};

const shiftTree = (node, shift) => {
    node.x += shift;
    node.children.forEach(child => shiftTree(child, shift));
};

const getLeftContour = (node, modSum = 0, contour = []) => {
    contour[node.y] = Math.min(contour[node.y] || Infinity, node.x + modSum);
    modSum += node.mod;

    node.children.forEach(child => getLeftContour(child, modSum, contour));

    return contour;
};

const getRightContour = (node, modSum = 0, contour = []) => {
    if (!node) return contour;
    contour[node.y] = Math.max(contour[node.y] || -Infinity, node.x + modSum);
    modSum += node.mod;

    node.children.forEach(child => getRightContour(child, modSum, contour));

    return contour;
};

const TreeNodeComponent = ({ node }) => {
    return (
        <g transform={`translate(${node.x * 50}, ${node.y * 50})`}>
            <circle cx="0" cy="0" r="10" fill="lightblue" />
            <text x="-10" y="-10">{node.id}</text>
            {node.children.map(child => (
                <TreeNodeComponent key={child.id} node={child} />
            ))}
        </g>
    );
};

const TreeComponent = ({ root }) => {
    return (
        <svg width="100%" height="100%">
            <TreeNodeComponent node={root} />
        </svg>
    );
};

// Example usage:
const root = new TreeNode('A', [
    new TreeNode('B'),
    new TreeNode('C', [
        new TreeNode('D'),
        new TreeNode('E', [
            new TreeNode('F'),
            new TreeNode('G'),
        ]),
    ]),
]);

const App = () => (
    <div>
        <TreeComponent root={root} />
    </div>
);

// Apply the algorithm steps
calculateInitialX(root);
positionNodesUnderParent(root);
checkNodeConflicts(root);
calculateFinalX(root);
adjustTreeToView(root); // Adjust the tree to ensure it's fully visible

export default App;
