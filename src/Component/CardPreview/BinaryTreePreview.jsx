import React, { Component } from 'react'
import * as d3 from "d3"
import { insertByLevelrorder } from '../HeapBinaryTree/BasicOperationInHeap'

export class BinaryTreePreview extends Component {
    constructor() {
        super()
        this.svgRef = React.createRef();
        this.state = {
            root: null
        }
    }
    componentDidMount() {
        const maxValueInNode = 100, maxNoOfNode = 15, minNoOfNode = 7;
        const getRandomInt = (min, max) => {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        const noOfNode = getRandomInt(minNoOfNode, maxNoOfNode);
        const randomSortedArr = [];
        for (let j = 0; j < noOfNode; j++) {
            randomSortedArr.push(getRandomInt(0, maxValueInNode));
        }
        randomSortedArr.sort((a, b) => a - b);

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
        this.drawTree(initialRoot, width, height)
        this.setState({ root: initialRoot })
    }
    drawTree = (root, width, height) => {
        const svgRef = this.svgRef;
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const margin = { top: height * .10, right: 0, bottom: height * .10, left: width * .10 };

        const treeLayout = d3.tree().size([width - margin.left - margin.right, height - margin.top - margin.bottom - 20]);
        treeLayout(root);

        var link = d3.linkVertical()
            .source(function (d) {
                return [d.source.x, d.source.y + margin.top];
            })
            .target(function (d) {
                return [d.target.x, d.target.y + margin.top];
            });

        svg.selectAll('path')
            .data(root.links())
            .enter()
            .append('path')
            .attr('d', link)
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
            .attr('r', 10)
            .attr('stroke', 'black')
            .attr('stroke-width', 0.5)
            .attr('fill', `url(#${gradientId})`);

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
    render() {
        const svgClassName = this.props.classes ? this.props.classes.svgClassName : ''; 
        return (
            <>
                <svg ref={this.svgRef} className={`${svgClassName} algorithm-image`}></svg >
            </>
        )
    }
}

export default BinaryTreePreview
