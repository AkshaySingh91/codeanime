import React, { createRef, useEffect, useState } from 'react'
import css from './CreateGraph.module.css'
import * as d3 from 'd3'

function CreateGraph(props) {
    const [isGraphDirected, setIsGraphDirected] = useState(true);
    const [isGraphWeighted, setIsGraphWighted] = useState(true);
    const [draggingNodePath, setDraggingNodePath] = useState(null); //to create path for visilation
    const [draggingNode, setDraggingNode] = useState(null); //to avoid self loop while creating path
    const svgRef = createRef();
    const { nodesDetails, setNodesDetails, links, setLinks, setSvgContainer, adjustLineForNodeRadius, setFlag } = props;

    const checkNodeOverlap = (relativeX, relativeY) => {
        for (let i = 0; i < nodesDetails.length; i++) {
            const node = nodesDetails[i];
            const space = 10;
            // we can use eucliden distance to avoid rather than  calculating x, y sepreately
            const distance = Math.sqrt(
                Math.pow(node.x - relativeX, 2) + Math.pow(node.y - relativeY, 2)
            );
            if (distance < node.r + 20 + space) {
                return false;
            }
        }
        return true;
    }
    const addNode = (e) => {
        const clientX = e.clientX, clientY = e.clientY;
        const { top, left } = svgRef.current.getBoundingClientRect();
        const relativeX = clientX - left, relativeY = clientY - top;
        // check if nodes overlap or not
        if (!checkNodeOverlap(relativeX, relativeY)) {
            return;
        }

        const details = { x: relativeX, y: relativeY, r: 20, n: nodesDetails.length };
        setNodesDetails([...nodesDetails, details])
        console.log(nodesDetails)
    }
    const cancleToCreateGraph = () => {
    }
    const clearGraph = () => {
        const svg = d3.select(svgRef.current)
        svg.selectAll("*").remove();
        // setNodesDetails([])
        // setLinks([])
        setFlag(true);
        setDraggingNode(null)
        setDraggingNodePath(null)
    }
    const handleDragStart = (node) => {
        setDraggingNode(node);
        // we have to store starting node 
        const newDragPath = {
            x1: node.x,
            x2: node.x,
            y1: node.y,
            y2: node.y
        }
        setDraggingNodePath(newDragPath);
    }
    const handleDragEnd = (e) => {
        if (!draggingNode) return;

        const { top, left } = svgRef.current.getBoundingClientRect();
        const relativeX = e.clientX - left;
        const relativeY = e.clientY - top;

        // Find the node where the user released the drag
        const targetNode = nodesDetails.find(
            (node) => Math.abs(node.x - relativeX) < 20 && Math.abs(node.y - relativeY) < 20
        );
        console.log('targetNode', targetNode)
        if (targetNode && targetNode !== draggingNode) {
            // Create a link from the dragging node to the target node
            setLinks([...links, { source: draggingNode, target: targetNode }]);
        }

        setDraggingNode(null);
        setDraggingNodePath(null);
    }
    const handleDragging = (e) => {
        if (draggingNode && draggingNodePath) {
            const { top, left } = svgRef.current.getBoundingClientRect();
            const relativeX = e.clientX - left;
            const relativeY = e.clientY - top;
            console.log(draggingNodePath)
            setDraggingNodePath({
                ...draggingNodePath,
                x2: relativeX,
                y2: relativeY,
            });
        }
    }

    useEffect(() => {
        console.log(links)
    }, [links])
    return (
        < >
            <div className={`${css["Edit-graph-container"]}`}
            >
                <div className={`${css["actions"]}`}>
                    <div className={`${css["drawgraph-actions"]}`}>
                        <p>Action</p>
                        <div className={`${css["btns"]}`}>
                            <button onClick={clearGraph}>Clear</button>
                            <button onClick={cancleToCreateGraph}>Cancle</button>
                            <button onClick={() => setSvgContainer('animation-container')}>Done</button>
                        </div>
                    </div>
                    <div className={`${css["graph-types"]}`}>
                        <p>Graph types</p>
                        <div className={`${css['btns']}`}>
                            <button className={`${isGraphDirected ? css['active'] : ''}`}
                                onClick={() => setIsGraphDirected(!isGraphDirected)}
                            >Directed</button>
                            <button className={`${!isGraphDirected ? css['active'] : ''}`}
                                onClick={() => setIsGraphDirected(!isGraphDirected)}
                            >Undirected</button>
                            <button className={`${isGraphWeighted ? css['active'] : ''}`}
                                onClick={() => setIsGraphWighted(!isGraphWeighted)}
                            >Weighted</button>
                            <button className={`${!isGraphWeighted ? css['active'] : ''}`}
                                onClick={() => setIsGraphWighted(!isGraphWeighted)}
                            >Unweighted</button>
                        </div>
                    </div>
                </div>
                <div id={`${css["graph-container"]}`}>
                    <svg ref={svgRef}
                        onClick={addNode}
                        onMouseMove={handleDragging}
                        onMouseUp={handleDragEnd}>
                        <defs>
                            <marker
                                id='head'
                                orient="auto"
                                markerWidth='5'
                                markerHeight='5'
                                refX='2.5'
                                refY='2.5'
                            >
                                <path d='M0,0 L5,2.5 L0,5 Z' fill="black" />
                            </marker>
                        </defs>
                        {
                            // it is just to visulize links 
                            draggingNodePath &&
                            <path
                                d={`M ${draggingNodePath.x1},${draggingNodePath.y1} L ${draggingNodePath.x2},${draggingNodePath.y2}`}
                                stroke="black"
                                strokeWidth="2"
                                fill="none"
                                markerEnd='url(#head)'
                                markerMid="url(#head)"
                            />
                        }
                        {links.map((link, index) => {
                            const adjustedTarget = adjustLineForNodeRadius(
                                link.source.x,
                                link.source.y,
                                link.target.x,
                                link.target.y
                            );
                            return (
                                <path
                                    key={index}
                                    d={`M ${link.source.x},${link.source.y} L ${adjustedTarget.x},${adjustedTarget.y}`}
                                    fill="none"
                                    stroke="black"
                                    strokeWidth="2"
                                    markerEnd='url(#head)'
                                    markerMid="url(#head)"
                                />
                            )
                        })}
                        {
                            nodesDetails.map((node, idx) => {
                                return (
                                    <g key={idx}
                                        onMouseDown={() => handleDragStart(node)}
                                    >
                                        <circle
                                            cx={node.x}
                                            cy={node.y}
                                            r={20}
                                            fill="orange"
                                            stroke="black"
                                            strokeWidth="2"

                                        />
                                        <text
                                            x={node.x} y={node.y}
                                            dominantBaseline={'middle'}
                                            fontSize={20}
                                            fontWeight={'bold'}>{idx}</text>
                                    </g>
                                )
                            })
                        }

                    </svg>
                </div>

            </div>
        </>
    )
}

export default CreateGraph
