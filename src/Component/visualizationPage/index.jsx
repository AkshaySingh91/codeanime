import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './index.css';
import { algorithmName } from '../../Datastore/algoritmInfo';
import BinarySearchTree from '../BinarySearchTree/BinarySearchTree';
class AlgorithmVisualization extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedAlgorithm: 'Knight\'s Tour',
            speed: 1,
            code: '',
            visualizationSvg: null,
            toggleCollapse: {},
            isPlaying: 'play',
            activeTab: 'code'
        };
        this.svgAreaRef = React.createRef();
        this.svgAreaScrollRef = React.createRef();
    }

    handleSpeedChange = (e) => {
        this.setState({ speed: e.target.value });
    }
    handleToggleCollapse = (category) => {
        this.setState((prevState) => ({
            toggleCollapse: {
                ...prevState.toggleCollapse,
                [category]: !prevState.toggleCollapse[category]
            }
        }));
    }
    handlePlayBtn = (e) => {
        this.setState({ isPlaying: this.state.isPlaying === 'play' ? 'pause' : 'play' })
    }
    handleTabClick = (tabName) => {
        this.setState({ activeTab: tabName });
    }
    render() {
        const { speed } = this.state;

        return (
            <div className="algorithm-visualization-page">
                <div className="sidebar">
                    <div className="data-structure-list">
                        {algorithmName.map(({ dataStructure, algorithms }, idx) => (
                            <div key={idx} className="algorithm-category">

                                <button type="button" className={`${''} collapsible`}
                                    onClick={() => {
                                        this.handleToggleCollapse(dataStructure)
                                    }
                                    }>{dataStructure}
                                    <i className="arrow right"></i>
                                </button>
                                {
                                    this.state.toggleCollapse[dataStructure] &&
                                    <div className="content">
                                        <ul className="algorithm-list">
                                            {algorithms.map((algo, index) => (
                                                <li key={index}>
                                                    <Link>{algo}</Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                }
                            </div>
                        ))}
                    </div>
                </div>

                {/* Visualization Area */}
                <main className="main-content">
                    <div className="controller-bar">
                        <div className="player">
                            {
                                this.state.isPlaying === 'play' &&
                                <button className="play"
                                    onClick={this.handlePlayBtn}
                                ></button>
                            }
                            {
                                this.state.isPlaying === 'pause' &&
                                <button className="pause"
                                    onClick={this.handlePlayBtn}
                                ></button>
                            }
                            <span>{this.state.isPlaying}</span>
                        </div>

                        <div className="speedController">
                            <label htmlFor="speed">Speed:</label>
                            <input
                                type="range"
                                id="speed"
                                min="0.5"
                                max="3"
                                step="0.1"
                                value={speed}
                                onChange={this.handleSpeedChange}
                            />
                            <span>{speed}x</span>
                        </div>

                    </div>
                    <div className="row">
                        <div className="mid-content">
                            <div className="visualization-container">
                                <div ref={this.svgAreaRef} className="svg-area">
                                    <BinarySearchTree />
                                </div>
                            </div>
                            {/* step Display */}
                            <div className="text-container">
                                <div className="console">
                                    <span className='header'>Console</span>
                                    <div className="step-line">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="right-panel">
                            <div className="tab-container">
                                <div className="code-tab active">
                                    <button>code</button>
                                </div>
                                {/* multiple tab btn will here */}
                            </div>
                            <div className="selected-tab-content">
                                <div className="code-container active">
                                    <code> </code>
                                </div>
                                {/* multipe tab based on how many feature support by algorithm */}
                            </div>
                        </div>
                    </div>




                </main>
            </div>
        );
    }
}


export default AlgorithmVisualization;
