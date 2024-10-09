import React, { Component } from 'react'
import * as  d3 from "d3"
import { Heapsort, insertByLevelrorder, InsertNode, DeleteNode, UpdateNode, ChangeMode, CreateHeap } from './BasicOperationInHeap'
import css from '../visualizationPage/index.module.css'
import { Editor } from '@monaco-editor/react'
import { HeapCodes } from './BasicOperationInHeap'
import { ThemeContext } from '../../Datastore/Context'

export class HeapBinaryTree extends Component {
    constructor() {
        super()
        this.state = {
            root: null,
            flattenTree: [{}],
            info: 'hello',
            treeType: 'min',
            mode: 'Binary Tree Mode',
            width: 300,
            height: 300,
            featureTab: 'Create',
            activeTab: 'Console',
            codeToDisplay: HeapCodes.find(code => code.name === 'Create').pseudocode
        }
        this.svgRef = React.createRef();
        this.consoleRef = React.createRef();
        this.isPlayingRef = React.createRef();
    }
    componentDidMount() {
        // Define the number of runs for the test data generated
        const maxValueInNode = 100, maxNoOfNode = 20, minNoOfNode = 6;
        const getRandomInt = (min, max) => {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        const noOfNode = getRandomInt(minNoOfNode, maxNoOfNode);
        const randomSortedArr = [];
        for (let j = 0; j < noOfNode; j++) {
            randomSortedArr.push(getRandomInt(0, maxValueInNode));
        }
        randomSortedArr.sort((a, b) => a - b);
        // give all node id bec it is req in heap sort
        let nodeCount = 1;
        let initialRoot = null, nodeWithId = []
        for (let i = 0; i < randomSortedArr.length; i++) {
            nodeWithId.push({ 'value': i, 'id': nodeCount })
            initialRoot = insertByLevelrorder(initialRoot, i, nodeCount)
            nodeCount++;
        }
        this.setState({ flattenTree: nodeWithId })
        initialRoot = d3.hierarchy(initialRoot)
        this.setState({ root: initialRoot })
        if (this.svgRef.current) {
            let { width, height } = this.svgRef.current.getBoundingClientRect();
            this.setState({ width: width, height: height });
            this.drawTree(initialRoot, width, height)
        }
    }
    checkIsPlaying = async () => {
        while (this.isPlayingRef.current === 'pause') {
            await new Promise(resolve => setTimeout(resolve, 100)); // Poll every 100ms
        }
    };
    componentDidUpdate(prevProps) {
        if (prevProps.isPlaying !== this.props.isPlaying) {
            this.isPlayingRef.current = this.props.isPlaying;
        }
    }
    updateRoot = (value) => {
        this.setState({ root: value })
    }
    updateFlattenTree = (value) => {
        this.setState({ flattenTree: value })
    }
    updateInfo = (value) => {
        this.setState({ info: value }, () => {
            if (this.consoleRef.current) {
                const span = document.createElement('span');
                span.innerHTML = value;
                this.consoleRef.current.append(span);
            }
        })
    }
    updateTreeType = (value) => {
        this.setState({ treeType: value })
    }
    updateMode = (value) => {
        this.setState({ mode: value })
    }
    swapNodeFromBottomUp = async (root, arr, treeType) => {
        if (arr.length <= 1) return root;
        const { speed = 1 } = this.props;
        let parentIdx = Math.floor((arr.length - 2) / 2), childIdx = arr.length - 1;
        //ye loop tab tak chalega jabtak root tak na swap kr le
        const delay = async (time) => { return new Promise((resolve) => { setTimeout(() => { resolve() }, time); }) }
        while (parentIdx >= 0) {
            await this.checkIsPlaying();
            let parent = arr[parentIdx];
            let child = arr[childIdx];
            if (treeType === 'min' && child.value < parent.value) {
                this.updateInfo(`${child.value} < ${parent.value}, therefore swap ${child.value} <-> ${parent.value}`)
                let parentNode = this.findNode(root, parent.id);
                let childNode = this.findNode(root, child.id);
                //only value has swapped not id
                await this.animateSwap(parentNode, childNode);
                //therefore we are swapping only values in arr not id 
                [arr[parentIdx].value, arr[childIdx].value] = [arr[childIdx].value, arr[parentIdx].value];
            }
            else if (treeType === 'max' && child.value > parent.value) {
                this.updateInfo(`${child.value} > ${parent.value}, therefore swap ${child.value} <-> ${parent.value}`)
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
            const { mode } = this.state;
            if (mode === 'Binary Tree Mode') {
                this.drawTree(root)
            } else {
                this.drawArray(root)
            }
            await delay(2000 / speed);
        }

        return root;
    };
    CreateBottomUp = async (array) => {
        const { treeType, mode } = this.state
        const { speed = 1 } = this.props;
        let r = null, realRoot
        const arr = []
        let nodesCount = 1;
        const delay = async (time) => { return new Promise((resolve) => { setTimeout(() => { resolve() }, time); }) }

        for (const i of array) {
            await this.checkIsPlaying();
            this.updateInfo(`${i} is inserted at back of array`)
            r = insertByLevelrorder(r, i, nodesCount)
            realRoot = d3.hierarchy(r)
            arr.push({ "value": i, "id": nodesCount })
            //to show that node is inseted in Lvl order
            if (mode === 'Binary Tree Mode') {
                this.drawTree(realRoot)
                console.log('object')
            } else {
                const nodes = realRoot.descendants();
                const nodeSize = 30
                const width = this.state.width;
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

            this.updateFlattenTree(arr)
            this.updateRoot(realRoot)
            // update r because it has previous relation 
            let temp = null
            for (const j of arr) {
                temp = insertByLevelrorder(temp, j.value, j.id)
            }
            r = temp;
            // will use it for speed component
            this.updateInfo(`${i} has inserted successfully.`)
            await delay(2000 / speed);
            nodesCount++
        }
    }
    swapNodeFromTopDown = async (root, id) => {
        const { treeType, mode } = this.state
        const { speed = 1 } = this.props;
        const svgRef = this.svgRef;
        const node = this.findNode(root, id)
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
                await delay(2000 / speed);
                await this.checkIsPlaying();
                let leftChild = node.children && node.children[0], rightChild = node.children && node.children[1]

                if (leftChild && leftChild.data.name < node.data.name) {
                    if (!rightChild || (leftChild && leftChild.data.name < rightChild.data.name)) {
                        this.updateInfo(`${node.data.name} > ${leftChild.data.name}, swap them.`)
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

                        this.updateInfo(`${node.data.name} <-> ${leftChild.data.name}, has been swapped.`)
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
                        this.updateInfo(`${node.data.name} > ${rightChild.data.name}, swap them.`)
                        // we will show swapping circle with red border
                        internalNodeId = rightChild.data.id
                        let swappingCircle = svg.selectAll('circle').filter(d => d.data.id === rightChild.data.id);
                        await swappingCircle
                            .transition()
                            .duration(500)
                            .attr('stroke', 'red')
                            .end();
                        await this.animateSwap(node, rightChild)

                        this.updateInfo(`${node.data.name} <-> ${rightChild.data.name}, has been swapped.`)
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
                    this.updateInfo(`${node.data.name} < ${rightChild.data.name}, swap them.`)
                    // we will show swapping circle with red border
                    let swappingCircle = svg.selectAll('circle').filter(d => d.data.id === rightChild.data.id);
                    internalNodeId = rightChild.data.id
                    await swappingCircle
                        .transition()
                        .duration(500)
                        .attr('stroke', 'red')
                        .end();
                    await this.animateSwap(node, rightChild)

                    this.updateInfo(`${node.data.name} <-> ${rightChild.data.name}, has been swapped.`)
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
                await delay(2000 / speed);
                await this.checkIsPlaying()

                let leftChild = node.children[0], rightChild = node.children[1]

                if (leftChild && leftChild.data.name > node.data.name) {
                    if (!rightChild || (leftChild && leftChild.data.name > rightChild.data.name)) {
                        this.updateInfo(`${node.data.name} < ${leftChild.data.name}, swap them.`)
                        // we will show swapping circle with red border
                        internalNodeId = leftChild.data.id;
                        let swappingCircle = svg.selectAll('circle').filter(d => d.data.id === leftChild.data.id);
                        await swappingCircle
                            .transition()
                            .duration(500)
                            .attr('stroke', 'red')
                            .end();
                        await this.animateSwap(node, leftChild)

                        this.updateInfo(`${node.data.name} <-> ${leftChild.data.name}, has been swapped.`)
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
                        await swapWithGreaterChild(leftChild)
                    }
                    else {
                        this.updateInfo(`${node.data.name} < ${rightChild.data.name}, swap them.`)
                        // we will show swapping circle with red border
                        internalNodeId = rightChild.data.id
                        let swappingCircle = svg.selectAll('circle').filter(d => d.data.id === rightChild.data.id);
                        await swappingCircle
                            .transition()
                            .duration(500)
                            .attr('stroke', 'red')
                            .end();
                        await this.animateSwap(node, rightChild)

                        this.updateInfo(`${node.data.name} <-> ${rightChild.data.name}, has been swapped.`)
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
                    this.updateInfo(`${node.data.name} < ${rightChild.data.name}, swap them.`)
                    // we will show swapping circle with red border
                    let swappingCircle = svg.selectAll('circle').filter(d => d.data.id === rightChild.data.id);
                    internalNodeId = rightChild.data.id
                    await swappingCircle
                        .transition()
                        .duration(500)
                        .attr('stroke', 'red')
                        .end();
                    await this.animateSwap(node, rightChild)

                    this.updateInfo(`${node.data.name} <-> ${rightChild.data.name}, has been swapped.`)
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
    CreateTopDown = async (array) => {
        const { treeType, mode, } = this.state
        const { speed = 1 } = this.props;
        let r = null, nodeCount = 1
        const arr = [];
        for (let i = 0; i < array.length; i++) {
            arr.push({ 'value': array[i], 'id': nodeCount })
            r = insertByLevelrorder(r, array[i], nodeCount)
            nodeCount++
        }
        r = d3.hierarchy(r)
        this.updateInfo('Insert all values from input array as it is, in level Order.')
        if (mode === 'Binary Tree Mode') {
            this.drawTree(r)
        } else {
            const nodes = r.descendants();
            const nodeSize = 30
            const width = this.state.width;
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
            await this.checkIsPlaying()
            this.updateInfo(`Swap ${treeType}(left, right) of sub-tree of value ${i.value}`);
            // delay(1000)
            r = await this.swapNodeFromTopDown(r, i.id)
            // we dont need to update internalNode bec we are passing next internal node & its id which is not changed above
            this.updateRoot(r)
            delay(2000 / speed);
        }
        // our root state is updated but its array representation is not
        let idx = 0
        r.each((d) => {
            arr[idx] = { 'value': d.data.name, 'id': d.data.id }
            idx++
        })
        this.updateFlattenTree(arr)
        // for HeapSort function because updateRoot(r) in loop is not refelecting in HeapSort fx
        return r;
    }
    drawTree = (root, w, h) => {
        const svgRef = this.svgRef;
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const width = w || this.state.width;
        const height = h || this.state.height;
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
            .attr('stroke', 'grey')
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
            .attr('stroke', 'grey')
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
        let bbox = g.node() && g.node().getBBox();

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
        const svgRef = this.svgRef;
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

    drawArray = (root) => {
        const svgRef = this.svgRef;
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
    handleTabClick = (e) => {
        if (e.target.tagName === 'BUTTON') {
            let code = HeapCodes.find(code => code.name === e.target.value)
            if (code) {
                code = code.pseudocode;
                console.log(code)
            } else {
                code = ''
            }
            this.setState({ codeToDisplay: code });
            this.setState({ featureTab: e.target.value })
        }
    }
    handleRightTabClick = (e) => {
        if (e.target.tagName === 'BUTTON') {
            this.setState({ activeTab: e.target.value })
        }
    }
    render() {

        const { featureTab, activeTab, root, flattenTree, treeType, mode, width, height, codeToDisplay } = this.state
        return (<>
            <div className={css["row"]}>
                <div className={css["mid-content"]}>
                    <div className={css["visualization-container"]}>
                        <div className={css["svg-area"]}>
                            <svg ref={this.svgRef}></svg>
                        </div>
                    </div>
                    {/* step Display */}
                    <div className={css["feature-container"]}>
                        <div className={css["tab-container"]} onClick={this.handleTabClick}>
                            <div className={`${css['Create-tab']} ${css['tab']} ${css[`${featureTab === 'Create' ? 'active' : ''}`]}`}>
                                <button value={'Create'} >Create</button>
                            </div>
                            <div className={`${css['Insert-tab']} ${css['tab']} ${css[`${featureTab === 'Insert' ? 'active' : ''}`]}`}>
                                <button value={'Insert'} >Insert</button>
                            </div>
                            <div className={`${css['Delete-tab']} ${css['tab']} ${css[`${featureTab === 'Delete' ? 'active' : ''}`]}`}>
                                <button value={'Delete'} >Delete</button>
                            </div>
                            <div className={`${css['ChangeMode-tab']} ${css['tab']} ${css[`${featureTab === 'ChangeMode' ? 'active' : ''}`]}`}>
                                <button value={'ChangeMode'} >ChangeMode</button>
                            </div>
                            <div className={`${css['Heapsort-tab']} ${css['tab']} ${css[`${featureTab === 'Heapsort' ? 'active' : ''}`]}`}>
                                <button value={'Heapsort'} >Heapsort</button>
                            </div>
                        </div>
                        <div className={css["selected-tab-content"]}>
                            {featureTab === 'Create' &&
                                <div className={css["create"]}>
                                    <CreateHeap
                                        findNode={this.findNode}
                                        animateSwap={this.animateSwap}
                                        drawArray={this.drawArray}
                                        drawTree={this.drawTree}
                                        swapNodeFromBottomUp={this.swapNodeFromBottomUp}
                                        swapNodeFromTopDown={this.swapNodeFromTopDown}
                                        CreateBottomUp={this.CreateBottomUp}
                                        CreateTopDown={this.CreateTopDown}
                                        root={root}
                                        flattenTree={flattenTree}
                                        updateRoot={this.updateRoot}
                                        updateFlattenTree={this.updateFlattenTree}
                                        svgRef={this.svgRef}
                                        updateInfo={this.updateInfo}
                                        treeType={treeType}
                                        mode={mode}
                                        updateMode={this.updateMode}
                                        width={width}
                                        height={height}
                                        consoleRef={this.consoleRef}
                                        isPlaying={this.props.isPlaying}
                                    />
                                </div>
                            }
                            {featureTab === 'Insert' &&
                                <div className={css["insert"]}>
                                    <InsertNode findNode={this.findNode}
                                        animateSwap={this.animateSwap}
                                        drawArray={this.drawArray}
                                        drawTree={this.drawTree}
                                        swapNodeFromBottomUp={this.swapNodeFromBottomUp}
                                        swapNodeFromTopDown={this.swapNodeFromTopDown}
                                        CreateBottomUp={this.CreateBottomUp}
                                        CreateTopDown={this.CreateTopDown}
                                        root={root}
                                        flattenTree={flattenTree}
                                        updateRoot={this.updateRoot}
                                        updateFlattenTree={this.updateFlattenTree}
                                        svgRef={this.svgRef}
                                        updateInfo={this.updateInfo}
                                        treeType={treeType}
                                        mode={mode}
                                        updateMode={this.updateMode}
                                        width={width}
                                        height={height}
                                        isPlaying={this.props.isPlaying}
                                        consoleRef={this.consoleRef} />
                                </div>
                            }
                            {featureTab === 'Delete' &&
                                <div className={css["Delete"]}>
                                    <DeleteNode findNode={this.findNode}
                                        animateSwap={this.animateSwap}
                                        drawArray={this.drawArray}
                                        drawTree={this.drawTree}
                                        swapNodeFromBottomUp={this.swapNodeFromBottomUp}
                                        swapNodeFromTopDown={this.swapNodeFromTopDown}
                                        CreateBottomUp={this.CreateBottomUp}
                                        CreateTopDown={this.CreateTopDown}
                                        root={root}
                                        flattenTree={flattenTree}
                                        updateRoot={this.updateRoot}
                                        updateFlattenTree={this.updateFlattenTree}
                                        svgRef={this.svgRef}
                                        updateInfo={this.updateInfo}
                                        treeType={treeType}
                                        mode={mode}
                                        updateMode={this.updateMode}
                                        width={width}
                                        height={height}
                                        isPlaying={this.props.isPlaying}
                                        consoleRef={this.consoleRef} />
                                </div>
                            }
                            {featureTab === 'ChangeMode' &&
                                <div className={css["ChangeMode"]}>
                                    <ChangeMode findNode={this.findNode}
                                        animateSwap={this.animateSwap}
                                        drawArray={this.drawArray}
                                        drawTree={this.drawTree}
                                        swapNodeFromBottomUp={this.swapNodeFromBottomUp}
                                        swapNodeFromTopDown={this.swapNodeFromTopDown}
                                        CreateBottomUp={this.CreateBottomUp}
                                        CreateTopDown={this.CreateTopDown}
                                        root={root}
                                        flattenTree={flattenTree}
                                        updateRoot={this.updateRoot}
                                        updateFlattenTree={this.updateFlattenTree}
                                        svgRef={this.svgRef}
                                        updateInfo={this.updateInfo}
                                        treeType={treeType}
                                        mode={mode}
                                        updateMode={this.updateMode}
                                        width={width}
                                        height={height}
                                        isPlaying={this.props.isPlaying}
                                        consoleRef={this.consoleRef} />
                                </div>
                            }
                            {featureTab === 'Heapsort' &&
                                <div className={css["Heapsort"]}>
                                    <Heapsort findNode={this.findNode}
                                        animateSwap={this.animateSwap}
                                        drawArray={this.drawArray}
                                        drawTree={this.drawTree}
                                        swapNodeFromBottomUp={this.swapNodeFromBottomUp}
                                        swapNodeFromTopDown={this.swapNodeFromTopDown}
                                        CreateBottomUp={this.CreateBottomUp}
                                        CreateTopDown={this.CreateTopDown}
                                        root={root}
                                        flattenTree={flattenTree}
                                        updateRoot={this.updateRoot}
                                        updateFlattenTree={this.updateFlattenTree}
                                        svgRef={this.svgRef}
                                        updateInfo={this.updateInfo}
                                        treeType={treeType}
                                        mode={mode}
                                        updateMode={this.updateMode}
                                        width={width}
                                        height={height}
                                        isPlaying={this.props.isPlaying}
                                        consoleRef={this.consoleRef} />
                                </div>
                            }
                            {featureTab === 'UpdateNode' &&
                                <div className={css["UpdateNode"]}>
                                    <UpdateNode findNode={this.findNode}
                                        animateSwap={this.animateSwap}
                                        drawArray={this.drawArray}
                                        drawTree={this.drawTree}
                                        swapNodeFromBottomUp={this.swapNodeFromBottomUp}
                                        swapNodeFromTopDown={this.swapNodeFromTopDown}
                                        CreateBottomUp={this.CreateBottomUp}
                                        CreateTopDown={this.CreateTopDown}
                                        root={root}
                                        flattenTree={flattenTree}
                                        updateRoot={this.updateRoot}
                                        updateFlattenTree={this.updateFlattenTree}
                                        svgRef={this.svgRef}
                                        updateInfo={this.updateInfo}
                                        treeType={treeType}
                                        mode={mode}
                                        updateMode={this.updateMode}
                                        width={width}
                                        height={height}
                                        isPlaying={this.props.isPlaying}
                                        consoleRef={this.consoleRef} />
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className={css[`${"text-container"}`]}>
                    <div className={css[`${"right-tab-container"}`]} onClick={this.handleRightTabClick}>
                        <div className={`${css['Console-tab']} ${css['tab']} ${css[`${activeTab === 'Console' ? 'active' : ''}`]}`}>
                            <button value={'Console'} >Console</button>
                        </div>
                        <div className={`${css['Code-tab']} ${css['tab']} ${css[`${activeTab === 'Code' ? 'active' : ''}`]}`}>
                            <button value={'Code'} >Code</button>
                        </div>
                    </div>

                    <div className={css["right-selected-tab-content"]}>
                        {
                            activeTab === 'Code' &&
                            <div className={`${css['code-container']} ${css['active']}`}>
                                <ThemeContext.Consumer>
                                    {({ theme = 'light' }) => (
                                        <Editor
                                            className={css['editor']}  // Add this class
                                            language='javascript'
                                            onMount={this.handleEditorDidMount}
                                            value={codeToDisplay}
                                            options={{
                                                padding: {
                                                    top: '10',
                                                    left: '0'
                                                },
                                                minimap: { enabled: false }, // Example of other editor options
                                                scrollBeyondLastLine: false,
                                                lineNumbersMinChars: 2,
                                                fontSize: "16px",
                                                fontFamily: 'Fira Code, monospace',
                                                lineHeight: '19',
                                                codeLensFontSize: '5',
                                                theme: theme === 'Dark' ? 'vs-dark' : 'vs-light',
                                                readOnly: true
                                            }}
                                            height={'80vh'}
                                            width={'100%'}
                                        />
                                    )}
                                </ThemeContext.Consumer>
                            </div>
                        }
                        {
                            activeTab === 'Console' &&
                            <div className={css[`${"console"} ${css['active']}`]}>
                                <div ref={this.consoleRef} className={css[`${"step-line"}`]}>
                                    <Text />
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div >
        </>)
    }
}

class Text extends Component {
    render() {
        const { info } = this.props
        return (<>
            <p>{info}</p>
        </>)
    }
}
export default HeapBinaryTree
