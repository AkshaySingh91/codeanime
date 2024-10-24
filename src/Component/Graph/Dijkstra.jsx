import React, { useState, useEffect } from 'react'
import css2 from '../visualizationPage/index.module.css';
import css from './Dijkstra.module.css'
import * as d3 from 'd3'
import CreateGraph from './CreateGraph'

function Dijkstra() {
    const [activeTab, setActiveTab] = useState('Console')
    const [featureTab, setFeatureTab] = useState('input')
    const [info, setInfo] = useState([])
    const consoleRef = React.createRef();
    const svgRef = React.createRef();
    const [svgContainer, setSvgContainer] = useState('animation-container')
    const [nodesDetails, setNodesDetails] = useState([
        { x: 242, y: 43, r: 20, n: 0 },
        { x: 93, y: 155, r: 20, n: 1 },
        { x: 156, y: 324, r: 20, n: 2 },
        { x: 378, y: 150, r: 20, n: 3 },
        { x: 319, y: 323, r: 20, n: 4 },
    ]);   //it will store node value & pos
    const [links, setLinks] = useState([
        {
            source: { x: 242, y: 43, r: 20, n: 0 },
            target: { x: 93, y: 155, r: 20, n: 1 }
        }, {
            source: { x: 93, y: 155, r: 20, n: 1 },
            target: { x: 378, y: 150, r: 20, n: 3 }
        }, {
            source: { x: 242, y: 43, r: 20, n: 0 },
            target: { x: 156, y: 324, r: 20, n: 2 }
        }, {
            source: { x: 156, y: 324, r: 20, n: 2 },
            target: { x: 319, y: 323, r: 20, n: 4 }
        }, {
            source: { x: 319, y: 323, r: 20, n: 4 },
            target: { x: 378, y: 150, r: 20, n: 3 }
        }, {
            source: { x: 319, y: 323, r: 20, n: 4 },
            target: { x: 93, y: 155, r: 20, n: 1 }
        }, {
            source: { x: 378, y: 150, r: 20, n: 3 },
            target: { x: 156, y: 324, r: 20, n: 2 }
        },
        {
            source: { x: 242, y: 43, r: 20, n: 0 },
            target: { x: 378, y: 150, r: 20, n: 3 }
        },
        {
            source: { x: 242, y: 43, r: 20, n: 0 },
            target: { x: 319, y: 323, r: 20, n: 4 }
        },
        {
            source: { x: 93, y: 155, r: 20, n: 1 },
            target: { x: 156, y: 324, r: 20, n: 2 }
        }
    ]); //it will show all relation
    const [inputVertex, setInputVertex] = useState(null)
    const [table, setTable] = useState([['<span>source</span>', '<span>destination</span>']]);

    const handleTabClick = (e) => {
        if (e.target.tagName === 'BUTTON') {
            console.log(e.target.value)
            setFeatureTab(e.target.value);
        }
    };
    const handleRightTabClick = (e) => {
        if (e.target.tagName === 'BUTTON') {
            setActiveTab(e.target.value)
        }
    }
    const adjustLineForNodeRadius = (x1, y1, x2, y2) => {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const scale = (distance - 20) / distance; // Adjust by radius
        return {
            x: x1 + dx * scale,
            y: y1 + dy * scale,
        };
    };
    const startVisulation = () => {
        console.log(inputVertex, nodesDetails.length)
        if (inputVertex < 0 || inputVertex >= nodesDetails.length) {
            alert('Enter valid node'); return;
        }

    }

    useEffect(() => {
        if (consoleRef.current) {
            const span = document.createElement('span');
            span.innerHTML = info;
            consoleRef.current.append(span);
        }
    }, [info])

    return (<>
        <div className={css2["row"]}>
            <div className={css2["mid-content"]}>
                <div className={css2["visualization-container"]}>
                    {svgContainer === 'animation-container' &&
                        <svg ref={svgRef} className={`${css['svg']}`}>
                            <g className={`${css['graph']}`}>
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
                                            <g key={idx}>
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
                            </g >
                            <div className={`${css['table']}`}>
                                <table className={`${css['visulation-table']}`}>
                                </table>
                            </div>
                        </svg>
                    }
                    {svgContainer === 'Edit-graph-container' &&
                        <CreateGraph
                            setSvgContainer={setSvgContainer}
                            nodesDetails={nodesDetails}
                            setNodesDetails={setNodesDetails}
                            links={links}
                            setLinks={setLinks}
                            adjustLineForNodeRadius={adjustLineForNodeRadius}
                        />
                    }
                </div>
                <div className={css2["feature-container"]}>
                    <div className={css2["tab-container"]} onClick={handleTabClick}>
                        <div className={`${css['input-tab']} ${css2['tab']} ${css2[`${featureTab === 'input' ? 'active' : ''}`]}`}>
                            <button value={'input'} >Input</button>
                        </div>
                        <div className={`${css['graph-tab']} ${css2['tab']} ${css2[`${featureTab === 'Edit-Graph' ? 'active' : ''}`]}`}>
                            <button value={'Edit-Graph'} >Edit Graph</button>
                        </div>
                    </div>
                    <div className={css2["selected-tab-content"]}>
                        {featureTab === 'input' &&
                            <>
                                <input type="number" id={`${css['vertex-input']}`}
                                    onChange={(e) => setInputVertex(Number.parseInt(e.target.value))}
                                />
                                <label htmlFor="vertex" id={`${css['label']}`}></label>
                                <button id={`${css['submit-vertex-btn']}`}
                                    onClick={startVisulation}
                                >GO</button>
                            </>
                        }
                        {featureTab === 'Edit-Graph' &&
                            <button onClick={() => {
                                setSvgContainer('Edit-graph-container')
                            }}>Edit Graph</button>
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
                            {/* <ThemeContext.Consumer>
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
                                                }}
                                                width={'100%'}
                                                height={'80vh'}
                                            />
                                        )}
                                    </ThemeContext.Consumer> */}
                        </div>
                    }
                    {
                        activeTab === 'Console' &&
                        <div className={css2["console"]}>
                            <div ref={consoleRef} className={css2["step-line"]}>
                                {/* Render all the console messages from the state */}
                                {info.map((message, index) => (
                                    <span key={index}>{message}</span>
                                ))}
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    </>);
}

export default Dijkstra
