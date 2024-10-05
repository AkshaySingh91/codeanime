import React, { Component } from 'react';
import css from './stackOperations.module.css';

export default class StackOperations extends Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.state = {
            stack: [],
            stackMaxSize: 11,
            inputValue: '',
            activeTab: 'Code'
        };
        this.consoleRef = React.createRef();
    }

    componentDidMount() {
        this.visualizeStack();
    }

    componentDidUpdate() {
        this.visualizeStack();
    }

    visualizeStack = () => {
        const { stack, stackMaxSize } = this.state;
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext('2d');
        const elementWidth = 60;
        const elementHeight = 40;

        // Set canvas width and height based on stack size
        canvas.width = stackMaxSize * (elementWidth + 10) + 100;
        canvas.height = 350;

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw stack elements
        for (let i = 0; i < stack.length; i++) {
            this.drawElement(ctx, i, stack[i], elementWidth, elementHeight);
        }

        // Draw empty slots
        for (let i = stack.length; i < stackMaxSize; i++) {
            this.drawElement(ctx, i, null, elementWidth, elementHeight);
        }

        // Draw the top pointer if stack has elements
        if (stack.length > 0) {
            this.drawTopPointer(ctx, stack.length - 1, elementWidth);
        }
    };


    drawElement = (ctx, index, value, elementWidth, elementHeight) => {
        const startX = 100 + index * (elementWidth + 10);
        const startY = 260;

        if (value !== null) {
            ctx.fillStyle = '#3498db'; // Color for filled stack elements
        } else {
            ctx.fillStyle = '#bdc3c7'; // Color for empty slots
        }

        ctx.fillRect(startX, startY, elementWidth, elementHeight);

        // Draw value inside filled elements
        if (value !== null) {
            ctx.fillStyle = '#ffffff';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(value, startX + elementWidth / 2, startY + elementHeight / 2);
        }

        // Draw index below each element
        ctx.fillStyle = '#2c3e50';
        ctx.font = '16px Arial';
        ctx.fillText(index, startX + elementWidth / 2, startY + elementHeight + 20);
    };


    drawTopPointer = (ctx, index, elementWidth) => {
        const startX = 100 + index * (elementWidth + 10);
        const startY = 200;

        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(startX, startY, elementWidth, 30);
        ctx.fillRect(startX + 26, startY + 20, 10, 40);

        ctx.fillStyle = '#ffffff';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('top', startX + elementWidth / 2, startY + 15);
    };

    handleChange = (e) => {
        this.setState({ inputValue: Number.parseInt(e.target.value) });
    };

    pushElement = () => {
        if (this.consoleRef.current) {
            this.consoleRef.current.innerHTML = ''
        }
        const { stack, stackMaxSize, inputValue } = this.state;
        if (stack.length < stackMaxSize) {
            const element = inputValue !== '' ? inputValue : Math.floor(Math.random() * 100);
            this.setState({ stack: [...stack, element], inputValue: '' });
            this.updateInfo(`${element} pushed in stack.`);
        } else {
            this.updateInfo(`Stack is full.`);
        }
    };

    popElement = () => {
        const { stack } = this.state;
        if (this.consoleRef.current) {
            this.consoleRef.current.innerHTML = ''
        }
        if (stack.length > 0) {
            this.updateInfo(`${stack[stack.length - 1]} popped.`);
            this.setState({ stack: stack.slice(0, stack.length - 1) });
        } else {
            this.updateInfo(`Stack Underflow.`);
        }
    };

    peekElement = () => {
        const { stack } = this.state;
        if (this.consoleRef.current) {
            this.consoleRef.current.innerHTML = ''
        }
        if (stack.length > 0) {
            this.updateInfo(`The topmost value is: ${stack[stack.length - 1]}.`);
        }
        else{
            this.updateInfo(`The stack is empty.`);
        }
    };

    isEmpty = () => {
        const { stack } = this.state;
        if (this.consoleRef.current) {
            this.consoleRef.current.innerHTML = ''
        }
        if (stack.length === 0) {
            this.updateInfo(`The stack is empty.`);
        } else {
            this.updateInfo(`The stack is not empty.`);
        }
    };

    clearStack = () => {
        this.setState({ stack: [] });
    };
    handleTabClick = (e) => {
        if (e.target.tagName === 'BUTTON') {
            this.setState({ activeTab: e.target.value })
        }
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
    render() {
        const { inputValue, activeTab } = this.state;

        return (<>
            <div className="row">
                <div className="mid-content">
                    <div className="visualization-container">
                        <div id={css['mainContent']}>
                            <canvas ref={this.canvasRef}></canvas>
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
                        <div className={`stackOperations-tab tab ${activeTab === 'stackOperations' ? 'active' : ''}`}>
                            <button value={'stackOperations'} >stackOperations</button>
                        </div>
                    </div>
                    <div className="selected-tab-content">
                        {activeTab === 'Code' &&
                            <div className="code-Expression active">
                                <code>BST code</code>
                            </div>
                        }
                        {activeTab === 'stackOperations' &&
                            <div className="stackOperations">
                                <label htmlFor="value">
                                    <b>Enter any value:</b>
                                </label>
                                <input
                                    id="inputValue"
                                    type="number"
                                    placeholder="Enter value to push"
                                    value={inputValue}
                                    onChange={this.handleChange}
                                    onKeyDown={(e) => e.key === 'Enter' && this.pushElement()}
                                />
                                <div className={css['buttons']}>
                                    <button onClick={this.pushElement}>Push</button>
                                    <button onClick={this.popElement}>Pop</button>
                                    <button onClick={this.peekElement}>Peek</button>
                                    <button onClick={this.isEmpty}>IsEmpty?</button>
                                    <button onClick={this.clearStack}>Clear Stack</button>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div >
        </>);
    }
}

;
