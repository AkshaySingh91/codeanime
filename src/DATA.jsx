import React, { Component } from 'react'
import * as d3 from "d3"

export function insertByLevelrorder(root, key, id) {
    if (!root) {
        return { name: key, children: [], id };
    }

    const queue = [root];

    while (queue.length > 0) {
        let currentNode = queue.shift();

        if (!currentNode.children || currentNode.children.length === 0) {
            currentNode.children = [{ name: key, children: [], id }];
            return root;
        }

        if (currentNode.children.length === 1) {
            currentNode.children.push({ name: key, children: [], id });
            return root;
        }

        queue.push(currentNode.children[0]);
        queue.push(currentNode.children[1]);
    }

    return root;
}


export class CreateBinaryHeap extends Component {
    constructor() {
        super()
        this.state = {
            K: null,
            deleteNodeIdx: null,
            updateNodeIdx: null,
            updateNodeValue: null,
            insertedNodeValue: null,
        }
    }
    drawTree = (root, w, h) => {
        const { svgRef } = this.props;
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const width = w || this.props.width;
        const height = h || this.props.height;
        console.log('width ', this.props.width)
        console.log('height ', this.props.height)
        const margin = { top: 20, right: 30, bottom: 20, left: 30 };

        const treeLayout = d3.tree().size([width - margin.left - margin.right, height - margin.top - margin.bottom - 20]);
        treeLayout(root);


        const linkGenerator = d3.linkVertical()
            .x(d => d.x)
            .y(d => d.y + margin.top);

        // Create links (paths)
        svg.selectAll('path')
            .data(root.links())
            .enter()
            .append('path')
            .attr('d', linkGenerator)
            .attr('fill', 'none')
            .attr('stroke', 'white')
            .attr('stroke-width', 1);

        // Create groups for each node
        const nodes = root.descendants();
        const nodeGroups = svg.selectAll('g.node')
            .data(nodes)
            .enter()
            .append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${d.x}, ${d.y + margin.top})`);


        // Add circles to each group
        nodeGroups.append('circle')
            .attr('r', 15)
            .attr('stroke', 'white')
            .attr('fill', (d) => {
                if (d.parent && d.data.children.length === 0) {
                    if (d === d.parent.children[0]) {
                        return '#f4f1bb'; //left node
                    }
                    else {
                        return '#ead7c3'; //right node
                    }
                }
                return '#dce0d9';
            });

        let g = d3.select("g.node");
        // getBBox gives height, weigth, x, y of selected element
        let bbox = g.node().getBBox();

        // Add text to each group
        nodeGroups.append('text')
            .attr('x', bbox.x + bbox.width / 2) // To position text vertically in the center of the circle
            .attr('y', bbox.y + bbox.height / 2 + 5) // To position text vertically in the center of the circle
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px')
            .attr('font-weight', 'bold')
            .text(d => d.data.name);
        // adding idx each group
        nodeGroups.append('text')
            .attr('x', bbox.x + bbox.width / 2) // To position text vertically in the center of the circle
            .attr('y', bbox.y + bbox.height / 2 + 30) // To position text vertically in the center of the circle
            .attr('text-anchor', 'middle')
            .attr('font-size', '15px')
            .attr('font-weight', 'bold')
            .attr('fill', 'red')
            .text(d => d.data.id);
    };

    findNode = (root, id) => {
        let foundNode = null;
        root.each(d => {
            if (d.data.id == id) {
                foundNode = d;
            }
        });
        return foundNode;
    }

    animateSwap = async (parentNode, childNode) => {
        const { svgRef } = this.props;
        let svg = d3.select(svgRef.current);
        // Select the parent and child 'g' groups
        const parentSelection = svg.selectAll('g.node')
            .filter(d => d.data.id === parentNode.data.id);

        const childSelection = svg.selectAll('g.node')
            .filter(d => d.data.id === childNode.data.id);

        // Animate the parent 'g' group to the child's position
        await parentSelection.transition()
            .duration(500)
            .attr('transform', `translate(${childNode.newX === undefined ? childNode.x : childNode.newX}, ${childNode.newY === undefined ? childNode.y + 20 : childNode.newY})`)
            .end();

        // Animate the child 'g' group to the parent's position
        await childSelection.transition()
            .duration(500)
            .attr('transform', `translate(${parentNode.newX === undefined ? parentNode.x : parentNode.newX}, ${parentNode.newY === undefined ? parentNode.y + 20 : parentNode.newY})`)
            .end();

        // Actual swap of data between parent and child nodes
        [parentNode.data.name, childNode.data.name] = [childNode.data.name, parentNode.data.name];
    };
    swapNodeFromBottomUp = async (root, arr, treeType) => {
        if (arr.length <= 1) return root;

        let parentIdx = Math.floor((arr.length - 2) / 2), childIdx = arr.length - 1;
        console.log(parentIdx)
        const { updateInfo } = this.props
        //ye loop tab tak chalega jabtak root tak na swap kr le
        while (parentIdx >= 0) {
            let parent = arr[parentIdx];
            let child = arr[childIdx];
            console.log(parent, child);
            console.log(treeType, child.value, parent.value)
            if (treeType === 'min' && child.value < parent.value) {
                updateInfo(`${child.value} < ${parent.value}, therefore swap ${child.value} <-> ${parent.value}`)
                let parentNode = this.findNode(root, parent.id);
                let childNode = this.findNode(root, child.id);
                console.log('parent ', parentNode, 'child ', childNode)
                //only value has swapped not id
                await this.animateSwap(parentNode, childNode);
                //therefore we are swapping only values in arr not id 
                [arr[parentIdx].value, arr[childIdx].value] = [arr[childIdx].value, arr[parentIdx].value];

                console.log(arr[parentIdx], arr[childIdx]);
            }
            else if (treeType === 'max' && child.value > parent.value) {
                updateInfo(`${child.value} > ${parent.value}, therefore swap ${child.value} <-> ${parent.value}`)
                let parentNode = this.findNode(root, parent.id);
                let childNode = this.findNode(root, child.id);

                await this.animateSwap(parentNode, childNode);
                [arr[parentIdx].value, arr[childIdx].value] = [arr[childIdx].value, arr[parentIdx].value];
            }
            else {
                break;
            }
            childIdx = parentIdx;
            parentIdx = Math.floor((parentIdx - 1) / 2);
            //it re-position nodes after translation on proper place
            const { mode } = this.props
            if (mode === 'Binary Tree Mode') {
                this.drawTree(root)
            } else {
                this.drawArray(root)
            }
        }

        return root;
    };

    drawArray = (root) => {
        const { svgRef } = this.props;
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();
        const nodes = root.descendants();


        const nodeGroups = svg.selectAll('g.node')
            .data(nodes)
            .enter()
            .append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${d.newX}, ${d.newY})`);

        let g = d3.select("g.node");
        let bbox = g.node().getBBox();

        nodeGroups.append('circle')
            .attr('r', 15)
            .attr('stroke', 'white')
            .attr('fill', '#dce0d9')
        // Add text to each group
        nodeGroups.append('text')
            .attr('x', bbox.x + bbox.width / 2) // To position text vertically in the center of the circle
            .attr('y', bbox.y + bbox.height / 2 + 5) // To position text vertically in the center of the circle
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px')
            .attr('font-weight', 'bold')
            .text(d => d.data.name);

        nodeGroups.append('text')
            .attr('x', bbox.x + bbox.width / 2) // To position text vertically in the center of the circle
            .attr('y', bbox.y + bbox.height / 2 + 30) // To position text vertically in the center of the circle
            .attr('text-anchor', 'middle')
            .attr('font-size', '15px')
            .attr('font-weight', 'bold')
            .attr('fill', 'red')
            .text(d => d.data.id);

    }
    swapNodeFromTopDown = async (root, id) => {
        const node = this.findNode(root, id)
        const { updateInfo, svgRef, treeType, mode } = this.props
        let svg = d3.select(svgRef.current);

        let internalNode = svg.selectAll('circle').filter(d => d.data.id === id);
        await internalNode
            .transition()
            .duration(500)
            .attr('fill', 'orange')
            .end();

        const delay = async (time) => {
            return new Promise((resolve) => {
                setTimeout(() => { resolve() },
                    time);
            })
        }
        //it is required bec id in param will not be constant id we are swapping values with left/right not id therefore id of internal node in param will either id of left/right    
        let internalNodeId = null
        if (treeType === 'min') {
            const swapWithSmallerChild = async (node) => {
                if (node.children === undefined) return
                await delay(1000);
                console.log('node =', node)
                let leftChild = node.children && node.children[0], rightChild = node.children && node.children[1]

                if (leftChild && leftChild.data.name < node.data.name) {
                    if (!rightChild || (leftChild && leftChild.data.name < rightChild.data.name)) {
                        updateInfo(`${node.data.name} > ${leftChild.data.name}, swap them.`)
                        // we will show swapping circle with red border
                        // let leftIf = 
                        internalNodeId = leftChild.data.id;
                        let swappingCircle = svg.selectAll('circle').filter(d => d.data.id === leftChild.data.id);
                        await swappingCircle
                            .transition()
                            .duration(500)
                            .attr('stroke', 'red')
                            .end();
                        await this.animateSwap(node, leftChild)

                        updateInfo(`${node.data.name} <-> ${leftChild.data.name}, has been swapped.`)
                        if (mode === 'Binary Tree Mode') {
                            this.drawTree(root)
                        } else {
                            this.drawArray(root)
                        }

                        internalNode = svg.selectAll('circle').filter(d => d.data.id === internalNodeId);
                        await internalNode
                            .transition()
                            .duration(200)
                            .attr('fill', 'orange')
                            .end()
                        await swapWithSmallerChild(leftChild)
                    }
                    else {
                        updateInfo(`${node.data.name} > ${rightChild.data.name}, swap them.`)
                        // we will show swapping circle with red border
                        internalNodeId = rightChild.data.id
                        let swappingCircle = svg.selectAll('circle').filter(d => d.data.id === rightChild.data.id);
                        await swappingCircle
                            .transition()
                            .duration(500)
                            .attr('stroke', 'red')
                            .end();
                        await this.animateSwap(node, rightChild)

                        updateInfo(`${node.data.name} <-> ${rightChild.data.name}, has been swapped.`)
                        if (mode === 'Binary Tree Mode') {
                            this.drawTree(root)
                        } else {
                            this.drawArray(root)
                        }

                        internalNode = svg.selectAll('circle').filter(d => d.data.id === internalNodeId);
                        await internalNode
                            .transition()
                            .duration(200)
                            .attr('fill', 'orange')
                            .end()
                        await swapWithSmallerChild(rightChild)
                    }
                }
                else if (rightChild && rightChild.data.name < node.data.name) {
                    updateInfo(`${node.data.name} < ${rightChild.data.name}, swap them.`)
                    // we will show swapping circle with red border
                    let swappingCircle = svg.selectAll('circle').filter(d => d.data.id === rightChild.data.id);
                    internalNodeId = rightChild.data.id
                    await swappingCircle
                        .transition()
                        .duration(500)
                        .attr('stroke', 'red')
                        .end();
                    await this.animateSwap(node, rightChild)

                    updateInfo(`${node.data.name} <-> ${rightChild.data.name}, has been swapped.`)
                    this.drawTree(root)

                    internalNode = svg.selectAll('circle').filter(d => d.data.id === internalNodeId);
                    await internalNode
                        .transition()
                        .duration(200)
                        .attr('fill', 'orange')
                        .end();
                    await swapWithSmallerChild(rightChild)
                }

            }
            await swapWithSmallerChild(node)
        }
        else if (treeType === 'max') {
            const swapWithGreaterChild = async (node) => {
                if (node.children === undefined) return
                await delay(1000);

                let leftChild = node.children[0], rightChild = node.children[1]

                if (leftChild && leftChild.data.name > node.data.name) {
                    if (!rightChild || (leftChild && leftChild.data.name > rightChild.data.name)) {
                        updateInfo(`${node.data.name} < ${leftChild.data.name}, swap them.`)
                        // we will show swapping circle with red border
                        // let leftIf = 
                        internalNodeId = leftChild.data.id;
                        let swappingCircle = svg.selectAll('circle').filter(d => d.data.id === leftChild.data.id);
                        await swappingCircle
                            .transition()
                            .duration(500)
                            .attr('stroke', 'red')
                            .end();
                        await this.animateSwap(node, leftChild)

                        updateInfo(`${node.data.name} <-> ${leftChild.data.name}, has been swapped.`)
                        if (mode === 'Binary Tree Mode') {
                            this.drawTree(root)
                        } else {
                            this.drawArray(root)
                        }
                        console.log('id = ', internalNodeId)
                        internalNode = svg.selectAll('circle').filter(d => d.data.id === internalNodeId);
                        await internalNode
                            .transition()
                            .duration(200)
                            .attr('fill', 'orange')
                            .end()
                        await swapWithGreaterChild(leftChild)
                    }
                    else {
                        updateInfo(`${node.data.name} < ${rightChild.data.name}, swap them.`)
                        // we will show swapping circle with red border
                        internalNodeId = rightChild.data.id
                        let swappingCircle = svg.selectAll('circle').filter(d => d.data.id === rightChild.data.id);
                        await swappingCircle
                            .transition()
                            .duration(500)
                            .attr('stroke', 'red')
                            .end();
                        await this.animateSwap(node, rightChild)

                        updateInfo(`${node.data.name} <-> ${rightChild.data.name}, has been swapped.`)
                        if (mode === 'Binary Tree Mode') {
                            this.drawTree(root)
                        } else {
                            this.drawArray(root)
                        }

                        internalNode = svg.selectAll('circle').filter(d => d.data.id === internalNodeId);
                        await internalNode
                            .transition()
                            .duration(200)
                            .attr('fill', 'orange')
                            .end()
                        await swapWithGreaterChild(rightChild)
                    }
                }
                else if (rightChild && rightChild.data.name > node.data.name) {
                    updateInfo(`${node.data.name} < ${rightChild.data.name}, swap them.`)
                    // we will show swapping circle with red border
                    let swappingCircle = svg.selectAll('circle').filter(d => d.data.id === rightChild.data.id);
                    internalNodeId = rightChild.data.id
                    await swappingCircle
                        .transition()
                        .duration(500)
                        .attr('stroke', 'red')
                        .end();
                    await this.animateSwap(node, rightChild)

                    updateInfo(`${node.data.name} <-> ${rightChild.data.name}, has been swapped.`)
                    this.drawTree(root)

                    internalNode = svg.selectAll('circle').filter(d => d.data.id === internalNodeId);
                    await internalNode
                        .transition()
                        .duration(200)
                        .attr('fill', 'orange')
                        .end();
                    await swapWithGreaterChild(rightChild)
                }

            }
            await swapWithGreaterChild(node)
        }
        if (mode === 'Binary Tree Mode') {
            this.drawTree(root)
        } else {
            this.drawArray(root)
        }
        return root
    }

    deleteNodeFromTree = async (index) => {
        //find deleting node & last leaf node
        const { root, updateFlattenTree, mode } = this.props
        const deleteNode = this.findNode(root, index)
        let nodes = root.descendants()
        const lastLeafNode = nodes[nodes.length - 1]
        // insted calling animateswap i am adding custom animation
        const { svgRef } = this.props;
        let svg = d3.select(svgRef.current);

        const deleteNodeSelection = svg.selectAll('g.node')
            .filter(d => d.data.id === deleteNode.data.id);

        const lastLeafNodeSelection = svg.selectAll('g.node')
            .filter(d => d.data.id === lastLeafNode.data.id);

        await deleteNodeSelection.select('circle').transition()
            .duration(500)
            .attr('stroke', 'red')
            .attr('stroke-width', '2px')
            .attr('fill', '#FF8A8A')
            .end();

        await lastLeafNodeSelection.select('circle').transition()
            .duration(500)
            .attr('stroke', 'red')
            .attr('stroke-width', '2px')
            .end();
        // Animate the parent 'g' group to the child's position
        console.log('leaf x, y', lastLeafNode.newX, lastLeafNode.newY, mode)
        await deleteNodeSelection.transition()
            .duration(1000)
            .attr('transform', `translate(${lastLeafNode.newX === undefined ? lastLeafNode.x : lastLeafNode.newX}, ${lastLeafNode.newY === undefined ? lastLeafNode.y + 20 : lastLeafNode.newY})`)
            .end();

        // Animate the child 'g' group to the parent's position
        await lastLeafNodeSelection.transition()
            .duration(1000)
            .attr('transform', `translate(${deleteNode.newX === undefined ? deleteNode.x : deleteNode.newX}, ${deleteNode.newY === undefined ? deleteNode.y + 20 : deleteNode.newY})`)
            .end();

        // Actual swap of data between parent and child nodes
        [deleteNode.data.name, lastLeafNode.data.name] = [lastLeafNode.data.name, deleteNode.data.name];

        // deleting last leaf node
        const parentOfLeaf = lastLeafNode.parent
        if (parentOfLeaf) {
            parentOfLeaf.children = parentOfLeaf.children.filter(child => child !== lastLeafNode);
            console.log(parentOfLeaf.children)
            if (parentOfLeaf.children.length === 0) {
                parentOfLeaf.children = null;  // Remove empty children array
            }
        }
        nodes = root.descendants()
        let arr = nodes.map(n => { return { 'value': n.data.name, 'id': n.data.id } })
        console.log(arr)
        updateFlattenTree(arr)
        if (mode === 'Binary Tree Mode') {
            this.drawTree(root);
        } else {
            this.drawArray(root);
            console.log('object')
        }
        // now we have to restore property of heap 
        // only changed node subarry will go on hepify process
        await this.swapNodeFromTopDown(root, index)
    }

    updateNodeFromTree = async (index, value) => {
        const { root, updateFlattenTree, mode } = this.props
        const updateNode = this.findNode(root, index)
        let nodes = root.descendants()
        // instead calling animateswap i am adding custom animation
        const { svgRef } = this.props;
        let svg = d3.select(svgRef.current);
        const updateNodeSelection = svg.selectAll('g.node').filter(d => d.data.id === updateNode.data.id);
        await updateNodeSelection.select('circle')
            .transition()
            .duration(1000)
            .attr('fill', '#90EDEF')
            .attr('stroke', '#03045E')
            .end();

        await updateNodeSelection.select('text')
            .transition()
            .duration(100)
            .attr('font-weight', '15px')
            .end();

        updateNode.data.name = value
        if (mode === 'Binary Tree Mode') {
            this.drawTree(root)
        } else {
            this.drawArray(root);
        }
        let arr = nodes.map(n => { return { 'value': n.data.name, 'id': n.data.id } })
        updateFlattenTree(arr);
        const { treeType } = this.props;
        arr = []
        nodes.forEach((n, i) => {
            if (i < index) {
                arr.push({ 'value': n.data.name, 'id': n.data.id });
            }
        })
        console.log(arr)
        await this.swapNodeFromBottomUp(root, arr, treeType)
    }

    insertNodeInTree = async (value) => {
        const { root, updateFlattenTree, updateRoot, mode } = this.props
        let nodes = root.descendants()
        let r = null
        nodes.forEach((n) => {
            r = insertByLevelrorder(r, n.data.name, n.data.id)
        })
        const id = nodes.length + 1
        r = insertByLevelrorder(r, value, id);
        r = d3.hierarchy(r)
        updateRoot(r);
        const delay = async (time) => { return new Promise((resolve) => { setTimeout(() => { resolve() }, time); }) }

        if (mode === 'Binary Tree Mode') {
            const { svgRef } = this.props;
            let svg = d3.select(svgRef.current);
            svg.selectAll("*").remove();

            const width = this.props.width;
            const height = this.props.height;
            const margin = { top: 20, right: 30, bottom: 20, left: 30 };
            nodes = r.descendants();

            const treeLayout = d3.tree().size([width - margin.left - margin.right, height - margin.top - margin.bottom - 20]);
            treeLayout(r);

            const linkGenerator = d3.linkVertical()
                .x(d => d.x)
                .y(d => d.y + margin.top);

            // Create links (paths)
            svg.selectAll('path')
                .data(r.links())
                .enter()
                .append('path')
                .attr('d', linkGenerator)
                .attr('fill', 'none')
                .attr('stroke', 'white')
                .attr('stroke-width', (d) => {
                    if (d.target.data.id === id) {
                        return 0
                    }
                    return 1
                })

            // Create groups for each node
            let nodeGroups = svg.selectAll('g.node')
                .data(nodes)
                .enter()
                .append('g')
                .attr('class', 'node')
                .attr('transform', d => `translate(${d.x}, ${d.y + margin.top})`);


            // Add circles to each group
            nodeGroups.append('circle')
                .attr('r', (d) => {
                    if (d.data.id === id) return 0;
                    return 15;
                })
                .attr('stroke', 'white')
                .attr('fill', (d) => {
                    if (d.parent && d.data.children.length === 0) {
                        if (d === d.parent.children[0]) {
                            return '#f4f1bb'; //left node
                        }
                        else {
                            return '#ead7c3'; //right node
                        }
                    }
                    return '#dce0d9';
                });

            let g = d3.select("g.node");
            // getBBox gives height, weigth, x, y of selected element
            let bbox = g.node().getBBox();

            // Add text to each group
            nodeGroups.append('text')
                .attr('x', bbox.x + bbox.width / 2) // To position text vertically in the center of the circle
                .attr('y', bbox.y + bbox.height / 2 + 5) // To position text vertically in the center of the circle
                .attr('text-anchor', 'middle')
                .attr('font-size', (d) => {
                    if (d.data.id === id) return '1px';
                    return '14px';
                })
                .attr('font-weight', 'bold')
                .text(d => d.data.name);
            // adding idx each group
            nodeGroups.append('text')
                .attr('x', bbox.x + bbox.width / 2) // To position text vertically in the center of the circle
                .attr('y', bbox.y + bbox.height / 2 + 30) // To position text vertically in the center of the circle
                .attr('text-anchor', 'middle')
                .attr('font-size', (d) => {
                    if (d.data.id === id) return '1px';
                    return '14px';
                })
                .attr('font-weight', 'bold')
                .attr('fill', 'red')
                .text(d => d.data.id);

            svg.selectAll('path')
                .data(r.links())
                .filter(d => d.target.data.id === id)
                .transition()
                .duration(3000)
                .attr('stroke-width', 1)

            nodeGroups = nodeGroups.filter(d => {
                if (d.data.id === id) return d
            })
            nodeGroups.select('circle')
                .transition()
                .duration(2000)
                .attr('r', 15)

            nodeGroups.selectAll('text')
                .transition()
                .duration(2100)
                .attr('font-size', '14px')
                .end()
            await delay(1000)
        } else {
            nodes = r.descendants();
            const nodeSize = 30
            const width = this.props.width;
            const margin = { top: 20, right: 30, bottom: 20, left: 30 };
            let noOfNodeInRow = Math.ceil((width - margin.left - margin.right) / nodeSize)

            nodes.forEach((node, i) => {
                if (node.newX === undefined) {
                    node.newX = (i % noOfNodeInRow) * nodeSize + nodeSize / 2
                }
                if (node.newY === undefined) {
                    node.newY = Math.floor(i / noOfNodeInRow) * nodeSize + margin.top;
                }
            });

            this.drawArray(r)
        }
        let arr = nodes.map(n => { return { 'value': n.data.name, 'id': n.data.id } })
        r = await this.swapNodeFromBottomUp(r, arr, this.props.treeType)
        updateRoot(r)
        updateFlattenTree(arr)
    }

    treeTransformaton = async () => {
        const { mode, root, updateRoot } = this.props
        const { svgRef } = this.props;
        const svg = d3.select(svgRef.current);
        const width = this.props.width;
        const height = this.props.height;
        const margin = { top: 20, right: 30, bottom: 20, left: 30 };

        let nodes = root.descendants();

        // svg.selectAll("*").remove();
        if (mode === 'Binary Tree Mode') {
            const nodeSize = 30
            let noOfNodeInRow = Math.ceil((width - margin.left - margin.right) / nodeSize)
            let rows = Math.ceil(nodes.length / noOfNodeInRow)
            let left, right
            let curr = nodes.length
            for (let i = 0; i < rows; i++) {
                if (curr <= noOfNodeInRow) {
                    left = Math.ceil(curr / 2)
                    right = curr - left
                    let start = Math.ceil(width / 2) - (left * nodeSize + 10 * left)


                    start = start + nodeSize + 10
                }
                else {
                    let start = margin.left

                    start = start + nodeSize + 10
                    curr--
                }
            }
            nodes.forEach((node, i) => {
                if (node.newX === undefined) {
                    node.newX = (i % noOfNodeInRow) * nodeSize + nodeSize / 2
                }
                if (node.newY === undefined) {
                    node.newY = Math.floor(i / noOfNodeInRow) * nodeSize + margin.top;
                }
            });

            await svg.selectAll('path')
                .transition().duration(200)
                .attr('stroke-width', 0)
                .remove()
                .end();

            svg.selectAll('circle')
                .attr('fill', '#dce0d9')

            await svg.selectAll('g.node')
                .transition().duration(1000)
                .attr('transform', d => `translate(${d.newX}, ${d.newY})`)
                .end();

            updateRoot(root);
        }
        else if (mode === 'Compact Array Mode') {
            const treeLayout = d3.tree().size([width - margin.left - margin.right, height - margin.top - margin.bottom - 20]);
            treeLayout(root);
            nodes = root.descendants()
            await svg.selectAll('g.node')
                .transition().duration(1000)
                .attr('transform', d => `translate(${d.x}, ${d.y + margin.top})`)
                .end();
            // we have to remove newX, newY
            nodes.forEach(d => {
                d.newX = d.newY = undefined
            })
            this.drawTree(root);
        }
    }

    render() {
        const { K } = this.state
        const { flattenTree, updateMode, updateRoot, updateFlattenTree, updateInfo, treeType, mode } = this.props
        return (<>
            <div className="container w-25">
                <button onClick={() => {
                    if (mode === 'Binary Tree Mode')
                        updateMode('Compact Array Mode')
                    else if (mode === 'Compact Array Mode')
                        updateMode('Binary Tree Mode')
                    this.treeTransformaton()
                }} className='btn btn-secondary'>{mode}</button>
            </div>
            <CreateBinaryHeap
                updateRoot={updateRoot} updateFlattenTree={updateFlattenTree} treeType={updateInfo} mode={mode} />
            <Heapsort/>
            <form className='my-3' onSubmit={(e) => {
                if (!this.state.deleteNodeIdx) {
                    alert('Enter valid index'); return;
                }
                else if (this.state.deleteNodeIdx > flattenTree.length) {
                    alert('Enter in Range value'); return;
                }
                this.deleteNodeFromTree(this.state.deleteNodeIdx)
                e.preventDefault()
            }}>
                <label htmlFor="indexOfNode">Delete node on index i</label>
                <div className="input-group w-25" >
                    <input name='indexOfNode' type="number" className="form-control w-25" id="indexOfNode" placeholder="Enter i"
                        onChange={(e) => {
                            this.setState({ deleteNodeIdx: Number.parseInt(e.target.value) })
                        }} />
                    <button type="submit" className="btn btn-primary">Go</button>
                </div>
            </form>

            <form className='my-3' onSubmit={(e) => {
                e.preventDefault()
                if (!this.state.updateNodeIdx || !this.state.updateNodeValue) {
                    alert('Enter valid input'); return;
                }
                else if (this.state.updateNodeIdx > flattenTree.length) {
                    alert('Enter in Range value'); return;
                }
                this.updateNodeFromTree(this.state.updateNodeIdx, this.state.updateNodeValue)
            }}>
                <label htmlFor="indexOfNode">update node on index i</label>
                <div className="input-group w-25" >
                    <input name='indexOfNode' type="number" className="form-control w-25" id="indexOfNode" placeholder="Enter i"
                        onChange={(e) => {
                            this.setState({ updateNodeIdx: Number.parseInt(e.target.value) })
                        }} />
                    <input name='newNodeValue' type="number" className="form-control w-25" id="newNodeValue" placeholder="value"
                        onChange={(e) => {
                            this.setState({ updateNodeValue: Number.parseInt(e.target.value) })
                        }} />
                    <button type="submit" className="btn btn-primary">Go</button>
                </div>
            </form>

            <form className='my-3' onSubmit={(e) => {
                e.preventDefault()
                if (!this.state.insertedNodeValue) {
                    alert('Enter valid value'); return;
                }
                this.insertNodeInTree(this.state.insertedNodeValue)
            }}>
                <label htmlFor="newNodeValue">Enter new node value</label>
                <div className="input-group w-25" >
                    <input name='newNodeValue' type="number" className="form-control w-25" id="newNodeValue" placeholder="value"
                        onChange={(e) => {
                            this.setState({ insertedNodeValue: Number.parseInt(e.target.value) })
                        }} />
                    <button type="submit" className="btn btn-primary">Go</button>
                </div>
            </form>


        </>)
    }
}

class CreateBinaryHeap {
    constructor() {
        super();
        this.state = {
            userInput: '',
            method: 'Botton-up Approch',
        }
    }

    CreateBottomUp = async (array) => {
        const { updateRoot, updateFlattenTree, updateInfo, treeType, mode } = this.props
        let r = null, realRoot
        const arr = []
        let nodesCount = 1;

        const delay = async (time) => { return new Promise((resolve) => { setTimeout(() => { resolve() }, time); }) }

        for (const i of array) {
            updateInfo(`${i} is inserted at back of array`)

            r = insertByLevelrorder(r, i, nodesCount)
            realRoot = d3.hierarchy(r)
            arr.push({ "value": i, "id": nodesCount })
            //to show that node is inseted in Lvl order
            if (mode === 'Binary Tree Mode') {
                this.drawTree(realRoot)
            } else {
                const nodes = realRoot.descendants();
                const nodeSize = 30
                const width = this.props.width;
                const margin = { top: 20, right: 30, bottom: 20, left: 30 };
                let noOfNodeInRow = Math.ceil((width - margin.left - margin.right) / nodeSize)
                nodes.forEach((node, i) => {

                    if (node.newX === undefined) {
                        node.newX = (i % noOfNodeInRow) * nodeSize + nodeSize / 2
                    }
                    if (node.newY === undefined) {
                        node.newY = Math.floor(i / noOfNodeInRow) * nodeSize + margin.top;
                    }
                });
                await this.drawArray(realRoot);
            }
            realRoot = await this.swapNodeFromBottomUp(realRoot, arr, treeType)
            // on write here translation on x, y is not proper may be because it render first before completing fx
            // this.drawTree(realRoot)

            updateFlattenTree(arr)
            updateRoot(realRoot)
            // update r because it has previous relation 
            let temp = null
            for (const j of arr) {
                temp = insertByLevelrorder(temp, j.value, j.id)
            }
            r = temp;
            // will use it for speed component
            updateInfo(`${i} has inserted successfully.`)
            await delay(500)
            nodesCount++
        }
    }
    CreateTopDown = async (array) => {
        const { updateRoot, updateFlattenTree, updateInfo, treeType, mode } = this.props
        let r = null, nodeCount = 1
        const arr = [];
        for (let i = 0; i < array.length; i++) {
            arr.push({ 'value': array[i], 'id': nodeCount })
            r = insertByLevelrorder(r, array[i], nodeCount)
            nodeCount++
        }
        r = d3.hierarchy(r)
        updateInfo('Insert all values from input array as it is, in level Order.')
        if (mode === 'Binary Tree Mode') {
            this.drawTree(r)
        } else {
            const nodes = r.descendants();
            const nodeSize = 30
            const width = this.props.width;
            const margin = { top: 20, right: 30, bottom: 20, left: 30 };
            let noOfNodeInRow = Math.ceil((width - margin.left - margin.right) / nodeSize)
            nodes.forEach((node, i) => {

                if (node.newX === undefined) {
                    node.newX = (i % noOfNodeInRow) * nodeSize + nodeSize / 2
                }
                if (node.newY === undefined) {
                    node.newY = Math.floor(i / noOfNodeInRow) * nodeSize + margin.top;
                }
            });
            this.drawArray(r);
        }
        const internalNode = arr.slice(0, Math.floor(arr.length / 2)).reverse()

        const delay = async (time) => { return new Promise((resolve) => { setTimeout(() => { resolve() }, time); }) }
        for (const i of internalNode) {
            updateInfo(`Swap ${treeType}(left, right) of sub-tree of value ${i.value}`);
            // delay(1000)
            r = await this.swapNodeFromTopDown(r, i.id)
            // we dont need to update internalNode bec we are passing next internal node & its id which is not changed above
            updateRoot(r)
            delay(500)
        }
        // our root state is updated but its array representation is not
        let idx = 0
        r.each((d) => {
            arr[idx] = { 'value': d.data.name, 'id': d.data.id }
            idx++
        })
        updateFlattenTree(arr)
        // for HeapSort function because updateRoot(r) in loop is not refelecting in HeapSort fx
        return r;
    }
    render() {
        return (<>
            <form action="" onSubmit={(e) => {
                e.preventDefault()
                if (this.state.userInput === '') {
                    alert("Enter valid array")
                }
                let array = userInput.split(',').map((elem) => { return Number.parseInt(elem.trim()) })
                if (this.state.method === 'Heapify O(n)') {
                    this.CreateTopDown(array)
                }
                else {
                    this.CreateBottomUp(array)
                }
            }}>
                <div className="input-group mb-3 w-25">
                    <select className="px-2 py-1 my-4 custom-select" id="inputGroupSelect04"
                        onChange={(e) => {
                            this.setState({ method: e.target.value })
                        }}>
                        <option className='px-2' value={'Botton-up Approch'} >Botton-up Approch</option>
                        <option className='px-2' value={'Heapify O(n)'} >Heapify O(n)</option>
                    </select>
                    <div className="input-group">
                        <input value={this.state.userInput} name='userInput' type="text" className="form-control" placeholder="eg: 45, 12, 34"
                            onChange={(e) => {
                                this.setState({ userInput: e.target.value })
                            }} />

                        <button className="btn btn-outline-secondary" type="submit">Insert</button>
                    </div>
                </div>
            </form>
        </>)
    }
}

class Heapsort {
    constructor() {
        super();
    }
    HeapSort = async () => {
        let { root, updateInfo, treeType, mode } = this.props
        let nodes = root.descendants()
        if (nodes.length <= 1) {
            console.log("Tree is empty or has only root");
            return;
        }
        const { svgRef } = this.props;
        let svg = d3.select(svgRef.current);

        const delay = async (time) => {
            return new Promise((resolve) => {
                setTimeout(() => { resolve() },
                    time);
            })
        }

        const sortedArr = []
        const { K } = this.state;
        let i = 0
        while (i < K) {
            updateInfo(`root store ${treeType} element`);
            nodes = root.descendants()
            const lastLeafNode = nodes[nodes.length - 1]

            const rootSelection = svg.selectAll('g.node')
                .filter(d => d.data.id === root.data.id);
            const leafSelection = svg.selectAll('g.node')
                .filter(d => d.data.id === lastLeafNode.data.id);
            // Animate parent
            await rootSelection.transition()
                .select('circle')
                .duration(1000)
                .attr('r', 1)
                .end();
            updateInfo(`Take out root node of value ${root.data.name}.`);
            await rootSelection.transition()
                .select('text')
                .duration(100)
                .attr('font-size', '1px')
                .end();
            updateInfo(`Replace last leaf node ${lastLeafNode.data.name} with root.`);
            // Animate leafnode
            await leafSelection.transition()
                .select('circle')
                .duration(300)
                .attr('stroke', "red")
                .attr('fill', '#FF8A8A')
                .end();
            // move leaf to root 
            await leafSelection.transition()
                .attr('transform', `translate(${root.newX === undefined ? root.x : root.newX}, ${root.newX === undefined ? root.y + 20 : root.newY})`)
                .duration(1000)
                .attr('text-color', "red")
                .end();
            const parentNode = lastLeafNode.parent
            let leafValue = lastLeafNode.data.name
            if (parentNode) {
                parentNode.children = parentNode.children.filter(child => child !== lastLeafNode);
                console.log(parentNode.children)
                if (parentNode.children.length === 0) {
                    parentNode.children = null;  // Remove empty children array
                }
            }
            sortedArr.push(root.data.name)
            console.log('sortedArr = ', sortedArr)

            root.data.name = leafValue
            if (mode === 'Binary Tree Mode') {
                this.drawTree(root);
            } else {
                this.drawArray(root);
            }
            updateInfo(`The new Root is ${leafValue}`)
            // to re-create max heap
            const arr = []
            root.each((d) => {
                arr.push(d.data.name)
            })
            root = await this.CreateTopDown(arr)
            i++;
            updateInfo(`ExtractMax() has been completed, We return the max item: ${sortedArr[sortedArr.length - 1]}.`)
            // await delay(1000)
            updateInfo(`The partial sorted order is  ${sortedArr.toString()}.`)
        }
    }
    render() {
        return (<>
            <form className='my-3' onSubmit={(e) => {
                e.preventDefault()
                if (!this.state.K) {
                    alert("Enter Valid Input");
                    return;
                }
                if (K >= flattenTree.length) {
                    alert("K should be less than array length")
                } else {
                    this.HeapSort()
                }
            }}>
                <label htmlFor="noOfValue">Extract  {this.props.treeType}</label>
                <div className="input-group w-25" >
                    <input name='noOfValue' type="number" className="form-control w-25" id="noOfValue" placeholder="Enter K"
                        onChange={(e) => {
                            this.setState({ K: Number.parseInt(e.target.value) })
                        }} />
                    <button type="submit" className="btn btn-primary">Go</button>
                </div>
            </form>
        </>)
    }
}
export default { CreateBinaryHeap, insertByLevelrorder }

