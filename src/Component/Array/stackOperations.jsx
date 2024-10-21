import React, { Component } from 'react';
import css from './stackOperations.module.css';
import css2 from '../visualizationPage/index.module.css';
import { Editor } from '@monaco-editor/react';
import { ThemeContext } from '../../Datastore/Context';

const codeToDisplay = `class Stack {\n\
constructor() {\n\
    this.items = [];\n\
}\n\
push(element) {\n\
    this.items.push(element);\n\
}\n\
pop() {\n\
    if (this.isEmpty()) {\n\
        return null;\n\
    }\n\
    return this.items.pop();\n\
}\n\
peek() {\n\
    if (this.isEmpty()) {\n\
        return null;\n\
    }\n\
    return this.items[this.items.length - 1];\n\
}\n\
isEmpty() {\n\
    return this.items.length === 0;\n\
}\n\
}`;

export default class StackOperations extends Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.state = {
            stack: [],
            stackMaxSize: 11,
            inputValue: '',
            activeTab: 'Code',
            featureTab: 'stackOperations',
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
        else {
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
            this.setState({ featureTab: e.target.value })
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
    handleRightTabClick = (e) => {
        if (e.target.tagName === 'BUTTON') {
            this.setState({ activeTab: e.target.value })
        }

    }
    render() {
        const { inputValue, activeTab, featureTab } = this.state;

        return (<>
            <div className={css2["row"]}>
                <div className={css2["mid-content"]}>
                    <div className={css2["visualization-container"]}>
                        <div id={css['mainContent']}>
                            <canvas width={'100%'} height={'100%'} ref={this.canvasRef}></canvas>
                        </div>
                    </div>
                    <div className={css2["feature-container"]}>
                        <div className={css2["tab-container"]} onClick={this.handleTabClick}>
                            <div className={`${css['stackOperations-tab']} ${css2['tab']} ${css2[`${featureTab === 'Expression' ? 'active' : ''}`]}`}>
                                <button value={'stackOperations'} >stackOperations</button>
                            </div>
                        </div>
                        <div className={css2["selected-tab-content"]}>
                            {featureTab === 'stackOperations' &&
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
                </div>
                <div className={css2["text-container"]}>
                    <div className={css2[`${"right-tab-container"}`]} onClick={this.handleRightTabClick}>
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
                                            className={css['editor']}  // Add this class
                                            language='javascript'
                                            onMount={this.handleEditorDidMount}
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
                                <div ref={this.consoleRef} className={css2["step-line"]}>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div >
        </>);
    }
} 