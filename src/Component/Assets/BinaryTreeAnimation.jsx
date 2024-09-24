import * as d3 from "d3"
import React, { Component } from 'react'
import { insertByLevelrorder } from '../HeapBinaryTree/BasicOperationInHeap'

export default class BinaryTreeAnimation extends Component {
    constructor() {
        super()
        this.svgRef = React.createRef();
        this.state = {
            root: null
        }
    }

    drawTree = (root, width, height) => {
        const svgRef = this.svgRef;
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const margin = { top: 80, right: 30, bottom: 100, left: 100 };

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
            .attr('stroke-width', 2);

        // Create groups for each node
        const nodes = root.descendants();
        const nodeGroups = svg.selectAll('g.node')
            .data(nodes)
            .enter()
            .append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${d.x}, ${d.y + margin.top})`);

        const defs = svg.append("defs");

        const gradientId = `gradientId`;
        const gradient = defs.append("radialGradient")
            .attr("id", gradientId)
            .attr("cx", "50%")
            .attr("cy", "50%") 
            .attr("r", "50%")
            .attr("fx", "20%")
            .attr("fy", "30%");
        gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "white");  // light reflection
        gradient.append("stop")
            .attr("offset", "70%")
            .attr("stop-color", "#bbb");  // base color
        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "black"); // shadow effect

        nodeGroups.append('circle')
            .attr('r', 20)
            .attr('stroke', 'black')
            .attr('stroke-width', 2)
            .attr('fill', `url(#${gradientId})`);

        const circles = svg.selectAll('circle');
        // nodes.call()
        let g = d3.select("g.node");
        let bbox = g.node().getBBox();

        // Add text to each group (node data) 
        nodeGroups.append('text')
            .attr('x', bbox.x + bbox.width / 2)  // Center text horizontally
            .attr('y', bbox.y + bbox.height / 2 + 5)  // Center text vertically in the circle
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px')
            .attr('font-weight', 'bold')
            .text(d => d.data.name);

    };
    nodeAnimation = () => {
        const svg = d3.select(this.svgRef.current);
        const nodes = svg.selectAll('g.node')

        let startX, startY, initialX, initialY;
        const drag = d3.drag()
            .on("start", dragStart)
            .on("drag", dragging)
            .on("end", dragEnd);

        nodes.call(drag);
        let x, y;
        function dragStart(event, d) {
            console.log(event, d)
            d3.select(this)
            const point = d3.pointer(event, svg)
            startX = point[0];
            startY = point[1];
            initialX = d.x;
            initialY = d.y; 
            const transform = d3.select(this).attr('transform');
            const translate = transform.match(/translate\(([^)]+)\)/);
            if (translate) {
                [x, y] = translate[1].split(',').map(Number);
            }
        }

        // Dragging function (move the node and update the path)
        function dragging(event, d) {
            const point = d3.pointer(event, svg)
            const dx = point[0] - startX;
            const dy = point[1] - startY;
            // console.log(point[0], initialX+dx, point[1], initialY+dy)
            d3.select(this)
                .attr('transform', `translate(${initialX + dx}, ${initialY + dy})`)

            // Update the connecting lines dynamically
            svg.selectAll("path")
                .attr("x1", l => {console.log(l.source.data.name, l.target.data.name); return l.source.x})
                .attr("y1", l => l.source.y)
                .attr("x2", l => l.target.x)
                .attr("y2", l => l.target.y);
        }

        // Drag end (start gravitational pull effect)
        function dragEnd(event, d) { 
            d3.select(this)
                .transition()
                .duration(500)
                .attr('transform', `translate(${x}, ${y})`)

            // Update lines after transition
            svg.selectAll("line")
                .transition()
                .duration(1000)
                .attr("x1", l => l.source.x)
                .attr("y1", l => l.source.y)
                .attr("x2", l => l.target.x)
                .attr("y2", l => l.target.y);
        }
    }
    randomMove = async ()=> {
        const svg = d3.select(this.svgRef.current)
        const nodes = svg.selectAll('g.node')
        await nodes.transition()
          .duration(2000)
          .attr('transform', `translate(${(Math.random() * 20 - 10)}, ${(Math.random() * 20 - 10)})`)
          .on("end", this.randomMove) 
      }
            
    componentDidMount() {
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
        initialRoot = d3.hierarchy(initialRoot)
        const svgElement = this.svgRef.current;
        const { width, height } = svgElement.getBoundingClientRect();

        this.setState({ root: initialRoot }, () => {
            this.nodeAnimation();
        })
        this.drawTree(initialRoot, width, height)
        // this.randomMove()
    }
    render() {
        return (
            <>
                <svg ref={this.svgRef}></svg>
            </>
        )
    }
}

