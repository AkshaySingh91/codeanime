import React, { Component, useEffect, useState } from 'react';
import css from './queueOperations.module.css'; // Styles specific to queue operations
import css2 from '../visualizationPage/index.module.css'; // General styles
import * as d3 from "d3"
import { Editor } from '@monaco-editor/react'; // Monaco Editor for code display
import { ThemeContext } from '../../Datastore/Context'; // Context for theme management
const codeToDisplay = `let queue = [];\n\
let front = -1;\n\
let rear = -1;\n\
const queueMaxSize = 9;\n\
\n\
function enqueueElement(value) {\n\
    if (rear === queueMaxSize - 1) {\n\
        alert('Queue is full');\n\
    } else {\n\
        if (front === -1) front = 0;\n\
        queue[++rear] = value;\n\
    }\n\
}\n\
\n\
function dequeueElement() {\n\
    if (front === -1) {\n\
        alert('Queue Underflow');\n\
    } else {\n\
        queue[front] = undefined;\n\
        if (front === rear) {\n\
            front = rear = -1;\n\
        } else {\n\
            front++;\n\
        }\n\
    }\n\
}`;

const QueueOperations = (props) => {
    const [queue, setQueue] = useState([1, 2, 3])
    const [queueMaxSize, setQueueMaxSize] = useState(12)
    const [front, setFront] = useState(-1)
    const [rear, setRear] = useState(-1)
    const [inputValue, setInputvalue] = useState('')
    const [activeTab, setActiveTab] = useState('Console')
    const [featureTab, setFeatureTab] = useState('queueOperations')
    const [isCircular, setIsCircular] = useState(false) 
    const [info, setInfo] = useState('')
    const consoleRef = React.createRef();
    const svgRef = React.createRef();


    const enqueueElement = () => {
        const input = inputValue || Math.floor(Math.random() * 100)
        if (consoleRef.current) {
            consoleRef.current.innerHTML = ''
        }
        if (queue.length === queueMaxSize) {
            setInfo(`Queue is <b>Full</b>.`)
            return;
        }
        setQueue([...queue, input]);
        setInfo(`Enqueued <b>${input}</b> in queue`);
    };
    const dequeueElement = () => {
        if (consoleRef.current) {
            consoleRef.current.innerHTML = ''
        }
        if (queue.length <= 0) {
            setInfo(`Queue is <b>Empty</b>`);
            return;
        }

        setInfo(`Dequeued <b>${queue[0]}</b> in queue`);
        setQueue(queue.slice(1));
    };
    useEffect(() => {
        if (consoleRef.current) {
            const span = document.createElement('span');
            span.innerHTML = info;
            consoleRef.current.append(span);
        }
        console.log(info)
    }, [info])
    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();
        const height = 300;
        const width = 400;
        svg.attr('width', width).attr('height', height);
        const margin = { top: 50, bottom: 50, left: 50, right: 50 };

        const elementWidth = 50, elementHeight = 70
        const cylinder = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        const createCylinder = () => {
            cylinder.append("ellipse")
                .attr('cx', 0)
                .attr("rx", 20)
                .attr("ry", elementHeight / 2)
                .attr('stroke', '#433878')
                .attr('stroke-width', '2px')
                .attr('fill', '#AFAFD3');
            cylinder.append("ellipse")
                .attr('cx', elementWidth * queueMaxSize)  // Shift to the right
                .attr("rx", 20)
                .attr("ry", elementHeight / 2)
                .attr('stroke', '#433878')
                .attr('stroke-width', '2px')
                .attr('fill', '#AFAFD3');
            cylinder.append("line")
                .attr("x1", 0)
                .attr("y1", -elementHeight / 2)
                .attr("x2", elementWidth * queueMaxSize)
                .attr("y2", -elementHeight / 2)
                .attr('stroke', '#433878')
                .attr('stroke-width', '2px');
            cylinder.append("line")
                .attr("x1", 0)
                .attr("y1", elementHeight / 2)
                .attr("x2", elementWidth * queueMaxSize)
                .attr("y2", elementHeight / 2)
                .attr('stroke', '#433878')
                .attr('stroke-width', '2px');
            cylinder.append('rect')
                .attr('x', 0)
                .attr('y', -elementHeight / 2)
                .attr('width', elementWidth * queueMaxSize)
                .attr('height', elementHeight)
                .attr('fill', '#7E60BF')
                .attr('opacity', 0.3)
                .lower();
        }
        createCylinder();
        const group = cylinder.selectAll('g')
            .data(queue)
            .enter()
            .append('g')
            .attr('transform', (d, i) => `translate(${i * elementWidth}, 0)`);  // Position each group based on index

        // Append the front ellipse for each group (left side of the cylinder)
        group.append("ellipse").transition().duration(200)
            .attr('cx', 0)
            .attr("rx", 20)
            .attr("ry", elementHeight / 2)
            .attr('stroke', '#433878')
            .attr('stroke-width', '2px')
            .attr('fill', '#AFAFD3');  // Light color for the base

        // Append the rear ellipse for each group (right side of the cylinder)
        group.append("ellipse").transition().duration(200)
            .attr('cx', elementWidth)  // Shift to the right
            .attr("rx", 20)
            .attr("ry", elementHeight / 2)
            .attr('stroke', '#433878')
            .attr('stroke-width', '2px')
            .attr('fill', '#AFAFD3');  // Light color for the base

        // Draw the top line of the cylinder
        group.append("line").transition().duration(200)
            .attr("x1", 0)
            .attr("y1", -elementHeight / 2)
            .attr("x2", elementWidth)
            .attr("y2", -elementHeight / 2)
            .attr('stroke', '#433878')
            .attr('stroke-width', '2px');

        // Draw the bottom line of the cylinder
        group.append("line").transition().duration(200)
            .attr("x1", 0)
            .attr("y1", elementHeight / 2)
            .attr("x2", elementWidth)
            .attr("y2", elementHeight / 2)
            .attr('stroke', '#433878')
            .attr('stroke-width', '2px');

        // Draw the body of the cylinder (rectangle between the lines)
        group.append('rect')
            .attr('x', 0)
            .attr('y', -elementHeight / 2)
            .attr('width', elementWidth)
            .attr('height', elementHeight)
            .attr('fill', '#7E60BF')
            .attr('opacity', 0.7)
            .lower();
        group.append("text")
            .attr('x', elementWidth / 2 - 20)
            .attr('y', 0)
            .attr('dy', '0.35em')
            .attr('text-anchor', 'middle')
            .attr('fill', '#FFFFFF')  // White color for better contrast
            .attr('font-size', '1.5rem')
            .text((d) => d)

        // Add the 'F' (Front) marker to the first element
        group.filter((d, i) => i === 0)
            .append("text")
            .attr('x', -10)
            .attr('y', 70)
            .attr('dy', '0.35em')
            .attr('fill', 'Red')
            .attr('font-size', '2rem')
            .text('F');

        // Add the 'R' (Rear) marker to the last element
        group.filter((d, i) => i === queue.length - 1)
            .append("text")
            .attr('x', elementWidth - 20)
            .attr('y', 70)
            .attr('dy', '0.35em')
            .attr('fill', 'Red')
            .attr('font-size', '2rem')
            .text('R');
    }, [queue, queueMaxSize])


    const clearQueue = () => {
        setQueue([]);
    };

    const isEmpty = () => {
        if (consoleRef.current) {
            consoleRef.current.innerHTML = ''
        }
        setInfo(`Queue is <b>${queue.length === 0 ? 'empty' : 'full'}</b>`);
    };

    const convertToCircular = () => {
        setIsCircular(true);
    };


    const handleTabClick = (e) => {
        if (e.target.tagName === 'BUTTON') {
            setFeatureTab(e.target.value);
        }
    };
    const handleRightTabClick = (e) => {
        if (e.target.tagName === 'BUTTON') {
            setActiveTab(e.target.value)
        }
    }
    return (
        <>
            <div className={css2["row"]}>
                <div className={css2["mid-content"]}>
                    <div className={css2["visualization-container"]}>
                        <div className={css2["svg-area"]}>
                            <svg ref={svgRef}></svg>
                        </div>
                    </div>
                    <div className={css2["feature-container"]}>
                        <div className={css2["tab-container"]} onClick={handleTabClick}>
                            <div className={`${css['queueOperations-tab']} ${css2['tab']} ${css2[`active`]}`}>
                                <button value={'queueOperations'}>Queue Operations</button>
                            </div>
                        </div>
                        <div className={css2["selected-tab-content"]}>
                            {featureTab === 'queueOperations' &&
                                <div className="queueOperations">
                                    <label htmlFor="value"><b>Enter any value:</b></label>
                                    <input
                                        max={'100'}
                                        id="inputValue"
                                        type="number"
                                        placeholder="Enter value to enqueue"
                                        value={inputValue}
                                        onChange={(e) => {
                                            setInputvalue(Number.parseInt(e.target.value))
                                        }}
                                        onKeyDown={(e) => e.key === 'Enter' && enqueueElement()}
                                    />
                                    <div className={css['buttons']}>
                                        <button onClick={enqueueElement}>Enqueue</button>
                                        <button onClick={dequeueElement}>Dequeue</button>
                                        <button onClick={isEmpty}>IsEmpty?</button>
                                        <button onClick={clearQueue}>Clear Queue</button>
                                        <button onClick={convertToCircular}>Convert to Circular</button>
                                    </div>
                                    <label htmlFor="maxSize">Enter queue max size</label>
                                    <input type="number" name="maxSize" id="maxSize"
                                        onChange={(e) => {
                                            console.log(e.target.value )
                                            setQueueMaxSize(Number.parseInt(e.target.value))
                                        }}
                                    />
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className={css2["text-container"]}>
                    <div className={css2[`${"right-tab-container"}`]} onClick={handleRightTabClick}>
                        <div className={`${css2['Console-tab']} ${css2['tab']} ${css2[`${activeTab === 'Console' ? 'active' : ''}`]}`}>
                            <button value={'Console'} >Console</button>
                        </div>
                        <div className={`${css2['Code-tab']} ${css2['tab']} ${css2[`${activeTab === 'Code' ? 'active' : ''}`]}`}>
                            <button value={'Code'} >Code</button>
                        </div>
                    </div>
                    <div className={css2["right-selected-tab-content"]}>
                        {
                            activeTab === 'Code' &&
                            <div className={`${css['code-container']} ${css['active']}`}>
                                <ThemeContext.Consumer>
                                    {({ theme = 'light' }) => (
                                        <Editor
                                            className={css['editor']}  // Add  class
                                            language='javascript'
                                            value={codeToDisplay}
                                            options={{
                                                padding: {
                                                    top: '10',
                                                    left: '0',
                                                    bottom: '10'
                                                },
                                                minimap: { enabled: false }, // Example of other editor options
                                                scrollBeyondLastLine: false,
                                                lineNumbersMinChars: 2,
                                                fontSize: "16px",
                                                fontFamily: 'Fira Code, monospace',
                                                lineHeight: '19',
                                                codeLensFontSize: '5',
                                                theme: theme === 'Dark' ? 'vs-dark' : 'vs-light',
                                            }}
                                            width={'100%'}
                                            height={'80vh'}
                                        />
                                    )}
                                </ThemeContext.Consumer>
                            </div>}
                        {
                            activeTab === 'Console' &&
                            <div className={css2["console"]}>
                                <span className={css2["header"]}></span>
                                <div ref={consoleRef} className={css2["step-line"]}>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

export default QueueOperations;
