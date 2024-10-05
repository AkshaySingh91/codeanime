import React, { Component } from 'react';
import css from './queueOperations.module.css'; // Import CSS for styling

class QueueOperations extends Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.state = {
            queue: [],
            queueMaxSize: 7, // Maximum queue size for visualization
            front: -1, // Front pointer
            rear: -1, // Rear pointer
            isCircular: false, // For circular queue
            inputValue: '', // Holds user input value
            activeTab: 'Code',
        };
        this.consoleRef = React.createRef();
    }

    componentDidMount() {
        this.visualizeQueue();
    }

    componentDidUpdate() {
        this.visualizeQueue();
    }

    visualizeQueue = () => {
        const { queue, queueMaxSize, front, rear } = this.state;
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext('2d');
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw queue elements
        for (let i = 0; i < queueMaxSize; i++) {
            if (queue[i] !== undefined) {
                this.drawElement(ctx, i, queue[i]);
            } else {
                this.drawElement(ctx, i, null);
            }
        }

        // Draw front and rear pointers
        if (front !== -1) {
            this.drawPointer(ctx, front, 'f');
        }
        if (rear !== -1) {
            this.drawPointer(ctx, rear, 'r');
        }
    };

    drawElement = (ctx, index, value) => {
        const elementWidth = 30;
        const elementHeight = 20;
        const startX = 10 + index * (elementWidth + 10);
        const startY = 100;

        ctx.fillStyle = value !== null ? '#3498db' : '#bdc3c7';
        ctx.fillRect(startX, startY, elementWidth, elementHeight);

        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        if (value !== null) {
            ctx.fillText(value, startX + elementWidth / 2, startY + elementHeight / 2);
        }
    };

    drawPointer = (ctx, index, label) => {
        const elementWidth = 30;
        const startX = 10 + index * (elementWidth + 10);
        const startY = 130;

        ctx.fillStyle = label === 'f' ? 'red' : 'green'; // 'f' for front, 'r' for rear
        ctx.fillText(label, startX + elementWidth / 2, startY);
    };

    enqueueElement = () => {
        const { queue, queueMaxSize, front, rear, inputValue, isCircular } = this.state;
        const newValue = inputValue || Math.floor(Math.random() * 100);
        if (this.consoleRef.current) {
            this.consoleRef.current.innerHTML = ''
        }
        if (isCircular) {
            // Circular queue logic
            if ((rear + 1) % queueMaxSize === front) {
                this.updateInfo('Queue is full')
            } else {
                const newRear = (rear + 1) % queueMaxSize;
                const newQueue = [...queue];
                newQueue[newRear] = newValue;
                this.setState({
                    queue: newQueue,
                    rear: newRear,
                    front: front === -1 ? 0 : front,
                });
            }
        } else {
            // Linear queue logic
            if (rear === queueMaxSize - 1) {
                this.updateInfo('Queue is full');
            } else {
                const newRear = rear + 1;
                const newQueue = [...queue];
                newQueue[newRear] = newValue;
                this.updateInfo(`${newValue} enqueued in queue`);
                this.setState({
                    queue: newQueue,
                    rear: newRear,
                    front: front === -1 ? 0 : front,
                });
            }
        }
        this.setState({ inputValue: '' });
    };

    dequeueElement = () => {
        const { queue, front, rear, isCircular, queueMaxSize } = this.state;
        if (this.consoleRef.current) {
            this.consoleRef.current.innerHTML = ''
        }
        if (front === -1) {
            this.updateInfo('Queue Underflow')
        } else {
            const newQueue = [...queue];
            this.updateInfo(`${newQueue[front]} dequeued from queue.`)
            newQueue[front] = undefined;
            if (isCircular) {
                if (front === rear) {
                    this.setState({ front: -1, rear: -1, queue: [] });
                } else {
                    this.setState({ front: (front + 1) % queueMaxSize, queue: newQueue });
                }
            } else {
                if (front === rear) {
                    this.setState({ front: -1, rear: -1, queue: [] });
                } else {
                    this.setState({ front: front + 1, queue: newQueue });
                }
            }
        }
    };

    clearQueue = () => {
        this.setState({ queue: [], front: -1, rear: -1 });
    };

    peekElement = () => {
        if (this.consoleRef.current) {
            this.consoleRef.current.innerHTML = ''
        }
        const { queue, front } = this.state;
        if (front !== -1) {
            this.updateInfo(`The front value is: ${queue[front]}`);
        } else {
            this.updateInfo(`Queue is empty`);
        }
    };

    isEmpty = () => {
        const { front } = this.state;
        if (this.consoleRef.current) {
            this.consoleRef.current.innerHTML = ''
        }
        this.updateInfo(`${front === -1 ? 'The queue is empty' : 'The queue is not empty'}`);
    }
    convertToCircular = () => {
        this.setState({ isCircular: true });
        if (this.consoleRef.current) {
            this.consoleRef.current.innerHTML = ''
        }
        this.updateInfo(`Queue has been converted to Circular Queue`);
    };

    handleInputChange = (e) => {
        this.setState({ inputValue: e.target.value });
    };
    updateInfo = (value) => {
        this.setState({ info: value }, () => {
            if (this.consoleRef.current) {
                const span = document.createElement('span');
                span.innerHTML = value;
                this.consoleRef.current.append(span);
            }
        })
    }
    handleTabClick = (e) => {
        if (e.target.tagName === 'BUTTON') {
            this.setState({ activeTab: e.target.value })
        }
    }
    render() {
        const { inputValue, activeTab } = this.state;
        return (
            <>
                <div className={"row"}>
                    <div className={"mid-content"}>
                        <div className={"visualization-container"}>
                            <div className={`${"queueCanvasContainer"}`}>
                                <canvas ref={this.canvasRef} />
                            </div>
                        </div>
                        {/* step Display */}
                        <div className="text-container">
                            <div className="console">
                                <span className='header'>Console</span>
                                <div ref={this.consoleRef} className="step-line">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="right-panel">
                        <div className="tab-container" onClick={this.handleTabClick}>
                            <div className={`code-tab  tab ${activeTab === 'Code' ? 'active' : ''}`}>
                                <button value={'Code'}>code</button>
                            </div>
                            <div className={`queueOperations-tab tab ${activeTab === 'queueOperations' ? 'active' : ''}`}>
                                <button value={'queueOperations'} >queueOperations</button>
                            </div>
                        </div>
                        <div className="selected-tab-content">
                            {activeTab === 'Code' &&
                                <div className="code-Expression active">
                                    <code>BST code</code>
                                </div>
                            }
                            {activeTab === 'queueOperations' &&
                                <div className={css["queue-container"]}>
                                    <div className={css["queue-controls"]}>
                                        <input
                                            type="number"
                                            placeholder="Enter value to enqueue"
                                            value={inputValue}
                                            onChange={this.handleInputChange}
                                        />
                                        <button onClick={this.enqueueElement}>Enqueue</button>
                                        <button onClick={this.dequeueElement}>Dequeue</button>
                                        <button onClick={this.peekElement}>Peek</button>
                                        <button onClick={this.isEmpty}>Is Empty?</button>
                                        <button onClick={this.clearQueue}>Clear Queue</button>
                                        <button onClick={this.convertToCircular}>Convert to Circular</button>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </>
        );

    }
}

export default QueueOperations;
