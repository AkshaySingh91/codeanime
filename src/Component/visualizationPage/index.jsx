import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './index.css';
import { algorithmName } from '../../Datastore/algoritmInfo';

class AlgorithmVisualization extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedAlgorithm: 'Knight\'s Tour',
            speed: 1, // Default speed for algorithm visualization
            code: '',
            visualizationSvg: null, // Placeholder for the algorithm visualization SVG/canvas
            toggleCollapse: {},
            isPlaying: 'play',
        };
    }

    componentDidMount() {
        this.loadAlgorithmCode(this.state.selectedAlgorithm);
    }

    loadAlgorithmCode(algorithm) {
        // Load the algorithm's code dynamically based on selection (example logic)
        let code = '';
        switch (algorithm) {
            case 'Knight\'s Tour Problem':
                code = `// Knight's Tour Problem Code in JavaScript
                const N = 3;
                const board = new Array(N);
                // Initialize board with -1`;
                break;
            // Add other cases for different algorithms
            default:
                code = '// Algorithm Code will appear here';
        }
        this.setState({ code });
    }

    handleAlgorithmChange = (algorithm) => {
        this.setState({ selectedAlgorithm: algorithm });
        this.loadAlgorithmCode(algorithm);
        // You can also trigger a visualization change here
    }

    handleSpeedChange = (e) => {
        this.setState({ speed: e.target.value });
        // Update visualization speed
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
    render() {
        const {speed } = this.state;

        return (
            <div className="algorithm-visualization-page">
                {/* Sidebar - Data Structures and Subsections */}
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
                <div className="main-content">
                    <div className="controller-bar">
                        <div className="player">
                            {
                                this.state.isPlaying === 'play' &&
                                <button   className="play"
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

                    <div className="visualization-container">
                        <div className="svg-area"></div>
                    </div>

                    {/* Code Display */}
                    <div className="text-container">
                        <div className="console">
                            <span className='header'>Console</span>
                            <div className="step-line">
                                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Natus ipsum amet sequi nihil nulla illo nobis similique corrupti excepturi dolores, pariatur, facilis culpa. Necessitatibus omnis accusantium beatae quibusdam architecto nisi.
                            </div>
                        </div>
                        <div className="code-container">
                            <span className='header'>Code</span>
                            <code>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum nostrum deleniti quaerat optio ea iusto, architecto eum eveniet delectus? Impedit quidem veniam quis illo laborum et aliquam visicing elit. Dolorum nostrum deleniti quaerat optio ea iusto, architecto eum eveniet delectus? Impedit quidem veniam quis illo laborum et aliquam visicing elit. Dolorum nostrum deleniti quaerat optio ea iusto, architecto eum eveniet delectus? Impedit quidem veniam quis illo laborum et aliquam visicing elit. Dolorum nostrum deleniti quaerat optio ea iusto, architecto eum eveniet delectus? Impedit quidem veniam quis illo laborum et aliquam visicing elit. Dolorum nostrum deleniti quaerat optio ea iusto, architecto eum eveniet delectus? Impedit quidem veniam quis illo laborum et aliquam vitae eos quisquam!</code>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default AlgorithmVisualization;
