import React, { Component } from 'react'
import * as d3 from "d3"
import { insertByLevelrorder } from '../HeapBinaryTree/BasicOperationInHeap'
import SliderComponenet from './Slider';
import { Link } from 'react-router-dom';

class AlgorithmPage extends Component {
    constructor() {
        super();
        this.backgroundSvg = React.createRef();
    }

    render() {
        const { algorithmCard, path } = this.props;
        let description, name;

        algorithmCard.forEach(algoInfo => {
            if (algoInfo.path === path) {
                description = algoInfo.description;
                name = algoInfo.name;
            }

        });
        console.log(path)
        return (
            <>
                <section className="hero-section">
                    <div className="hero-content">
                        <h1>{name}</h1>
                        <p>{description}</p>
                        <div className="buttons">
                            <Link to={`${path}/algorithm`} className="play-btn">
                                <i className='fa fa-play' />
                            </Link>
                        </div>
                    </div>

                    <div className="svgContainer">
                        {/* it will change based on algorithm page */}
                        <BinaryTreeAnimation backgroundSvgRef={this.backgroundSvg} />
                    </div>

                    <div className="hero-slider">
                        <SliderComponenet algorithmCard={algorithmCard} />
                    </div>
                </section>
            </>
        );
    }
}


class BinaryTreeAnimation extends Component {
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

        const margin = { top: height * .10, right: width * .10, bottom: height * .10, left: width * .10 };

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

        const { width, height } = this.svgRef.current.getBoundingClientRect();
        const margin = { top: height * .10, right: width * .10, bottom: height * .10, left: width * .10 };

        let startX, startY, initialX, initialY;
        const drag = d3.drag()
            .on("start", dragStart)
            .on("drag", dragging)
            .on("end", dragEnd);

        nodes.call(drag);
        let x, y;
        function dragStart(event, d) {
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

        function dragging(event, d) {
            const point = d3.pointer(event, svg)
            const dx = point[0] - startX;
            const dy = point[1] - startY + margin.top;
            // console.log(point[0], initialX+dx, point[1], initialY+dy)
            d3.select(this)
                .attr('transform', `translate(${initialX + dx}, ${initialY + dy})`)

            let currXofNode = initialX + dx;
            let currYofNode = initialY + dy;
            const id = d.data.id
            // Update the connecting paths dynamically
            svg.selectAll('path')
                .attr('d', d3.linkVertical()
                    .x((d) => {
                        if (d.data.id === id) {
                            return currXofNode
                        }
                        return d.x
                    })
                    .y((d) => {
                        if (d.data.id === id) {
                            return currYofNode
                        }
                        return d.y + margin.top
                    })
                );
        }

        function dragEnd(event, d) {
            d3.select(this)
                .transition()
                .duration(500)
                .attr('transform', `translate(${d.x}, ${d.y + margin.top})`);

            svg.selectAll('path')
                .transition()
                .duration(500)
                .attr('d', d3.linkVertical()
                    .x(d => d.x)
                    .y(d => d.y + margin.top)
                );
        }

    }


    randomMove = async () => {
        const svg = d3.select(this.svgRef.current)
        const getRandomValue = (max, min) => {
            return (Math.random() * (max - min) + min)
        }
        // let x = 
        const nodes = svg.selectAll('g.node')
        nodes.transition()
            .duration(2000)
            .attr('transform', (d) => {
                console.log(d)
                return `translate(${getRandomValue(d.x + 50, d.x - 50)}, ${getRandomValue(d.y + 50, d.y - 50)})`
            })
        // .on("end", this.randomMove)
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
        this.setState({ root: initialRoot }, () => {
            this.nodeAnimation();
        })
        // this.randomMove()
        // this.generateBackgroundNetwork();
    }
    generateBackgroundNetwork = () => {
        const backgroundSvgRef = this.props.backgroundSvgRef.current;
        const svg = d3.select(backgroundSvgRef);
        let { width, height } = backgroundSvgRef.getBoundingClientRect();
        width += width / 2;


        let points = d3.range(50)
            .map(() => [Math.random() * width - 100, Math.random() * (height + 50 - height / 2) + height / 2]);

        points = points.map(([x, y]) => {
            y -= Math.random() * 50;
            return [x, y];
        });

        const delaunay = d3.Delaunay.from(points);

        const strokeColor = ['#EEEEEE', '#686D76', '#373A40', '#758694', '#758694']
        svg.selectAll("path.network")
            .data(d3.range(delaunay.triangles.length / 3)) // Create a range for the number of triangles
            .join("path")
            .attr("d", (d, i) => {
                const p0 = points[delaunay.triangles[i * 3]];
                const p1 = points[delaunay.triangles[i * 3 + 1]];
                const p2 = points[delaunay.triangles[i * 3 + 2]];
                return `M${p0[0]},${p0[1]}L${p1[0]},${p1[1]}L${p2[0]},${p2[1]}Z`;
            })
            .attr("stroke", () => {
                return strokeColor[Math.floor(Math.random() * strokeColor.length)]
            })
            .attr("stroke-width", 1)
            .attr("fill", "none");


        const defs = svg.append("defs");
        const gradientId = `networkGradientId`;
        const gradient = defs.append("radialGradient")
            .attr("id", gradientId)
            .attr("cx", "50%")
            .attr("cy", "50%")
            .attr("r", "50%")
            .attr("fx", "50%")
            .attr("fy", "50%");

        gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "white");  // Light reflection
        gradient.append("stop")
            .attr("offset", "70%")
            .attr("stop-color", "white");  // Base color
        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "white");  // Shadow effect

        svg.selectAll("circle.networkNode")
            .data(points)
            .join("circle")
            .attr("cx", d => d[0])
            .attr("cy", d => d[1])
            .attr("r", 4)
            .attr("fill", `url(#${gradientId})`);  // Reference the gradient using url()

    }

    render() {
        return (
            <>
                <svg ref={this.svgRef}></svg>
            </>
        )
    }
}


export { AlgorithmPage }