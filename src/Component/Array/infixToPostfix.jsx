import React, { Component, createRef } from 'react';
import css from './infixToPostfix.module.css';
import css2 from '../visualizationPage/index.module.css';

export class InfixToPostfix extends Component {
    constructor(props) {
        super(props);
        this.state = {
            steps: [],
            currentStep: -1,
            infixExpression: 'A + B * C + D',
            stepsArray: [],
            featureTab: 'Code',
            activeTab: 'Console',
            info: [],  // Changed to an array to store multiple messages
        };
        // Refs for the visual elements
        this.symbolScannedRef = createRef();
        this.stackRef = createRef();
        this.expressionRef = createRef();
        this.consoleRef = createRef();
    }

    componentDidUpdate() {
        const { currentStep, steps, isPaused, speed } = this.state;
        if (currentStep < steps.length - 1 && !isPaused) {
            const timer = setTimeout(() => {
                this.visualizeNextStep();
            }, speed);
            return () => clearTimeout(timer);
        }
    }

    startVisualization = (e) => {
        e.preventDefault(); // To prevent form submission reload
        const { infixExpression } = this.state;

        // Clear the visual elements
        if (this.symbolScannedRef.current && this.stackRef.current && this.expressionRef.current) {
            this.symbolScannedRef.current.innerHTML = '';
            this.stackRef.current.innerHTML = '';
            this.expressionRef.current.innerHTML = '';
        }
        this.setState({ stepsArray: [], info: [] }, () => {  // Clear the info state here
            this.setState({ currentStep: -1 }, () => {
                this.convertToPostfix(infixExpression);
            });
        });
    };

    setSteps = (value) => {
        this.setState(
            (prevState) => ({ stepsArray: [...prevState.stepsArray, value] }),
            () => {
                const currStep = this.state.stepsArray[this.state.stepsArray.length - 1];
                if (this.symbolScannedRef.current && this.stackRef.current && this.expressionRef.current) {
                    const span1 = document.createElement('span');
                    const span3 = document.createElement('span');
                    span1.innerText = currStep.scanSymbol;
                    const stackSpanArr = [];
                    for (let i = 0; i < currStep.stack.length; i++) {
                        let span2 = document.createElement('span');
                        span2.innerText = currStep.stack[i];
                        stackSpanArr.push(span2);
                    }
                    span3.innerText = currStep.exp;

                    this.symbolScannedRef.current.append(span1);
                    this.stackRef.current.innerHTML = '';
                    for (let i = 0; i < stackSpanArr.length; i++) {
                        this.stackRef.current.append(stackSpanArr[i]);
                    }
                    this.expressionRef.current.append(span3);
                }
            }
        );
    };

    convertToPostfix = async (expression) => {
        const stack = [];
        const output = [];
        const precedence = { '+': 1, '-': 1, '*': 2, '/': 2, '%': 2, '^': 3 };
        const operators = new Set(['+', '-', '*', '/', '^', '%']);

        const strArr = expression.split('');
        const { speed } = this.props;
        const delay = (time) => {
            return new Promise((resolve) => {
                setTimeout(() => { resolve() }, time / speed);
            });
        };
        for (const char of strArr) {
            if (/[A-Za-z0-9]/.test(char)) {
                output.push(char);
                this.setSteps({ scanSymbol: char, stack: [...stack], exp: output.join('') });
                this.updateInfo(`Append ${char} in postfix Expression.`);
            } else if (char === '(') {
                stack.push(char);
                this.setSteps({ scanSymbol: char, stack: [...stack], exp: output.join('') });
            } else if (char === ')') {
                while (stack.length && stack[stack.length - 1] !== '(') {
                    output.push(stack.pop());
                    this.setSteps({ scanSymbol: char, stack: [...stack], exp: output.join('') });
                    await delay(1000);
                }
                stack.pop();
                this.setSteps({ scanSymbol: char, stack: [...stack], exp: output.join('') });
            } else if (operators.has(char)) {
                while (stack.length && precedence[stack[stack.length - 1]] >= precedence[char]) {
                    this.updateInfo(`Pop ${stack[stack.length - 1]} from stack, append it in ${output.join('')}.`);
                    output.push(stack.pop());
                    this.setSteps({ scanSymbol: char, stack: [...stack], exp: output.join('') });
                    await delay(1000);
                }
                stack.push(char);
                this.updateInfo(`Push ${char} in stack.`);
                this.setSteps({ scanSymbol: char, stack: [...stack], exp: output.join('') });
            }
            await delay(1000);
        }

        // Pop remaining operators in the stack
        while (stack.length) {
            output.push(stack.pop());
            this.setSteps({ scanSymbol: ' ', stack: [...stack], exp: output.join('') });
            await delay(1000); // Add delay for each popping step
        }

        // Start the step-by-step visualization
        this.setState({ currentStep: 0 });
    };

    visualizeNextStep = () => {
        const { currentStep, stepsArray } = this.state;
        if (currentStep < stepsArray.length - 1) {
            this.setState((prevState) => ({
                currentStep: prevState.currentStep + 1,
            }));
        }
    };

    updateVisualization = (symbol, stack, expression) => {
        if (this.symbolScannedRef.current && this.stackRef.current && this.expressionRef.current) {
            this.symbolScannedRef.current.innerHTML += `<div class="row">${symbol}</div>`;
            this.stackRef.current.innerHTML = '';
            stack.forEach((item) => {
                this.stackRef.current.innerHTML = `<div class="stack-enter">${item}</div>` + this.stackRef.current.innerHTML;
            });
            this.expressionRef.current.innerHTML += `<div class="row">${expression}</div>`;
        }
    };

    setExpression = (e) => {
        this.setState({ infixExpression: e.target.value });
    };
    undo = () => {
        const { currentStep } = this.state;
        if (currentStep > 0) {
            this.setState(
                (prevState) => ({ currentStep: prevState.currentStep - 1 }),
                () => {
                    const newStep = this.state.stepsArray[currentStep - 1];
                    this.updateVisualization(newStep.scanSymbol, newStep.stack, newStep.exp);
                }
            );
        }
    };
    handleTabClick = (e) => {
        if (e.target.tagName === 'BUTTON') {
            this.setState({ featureTab: e.target.value });
        }
    };
    handleRightTabClick = (e) => {
        if (e.target.tagName === 'BUTTON') {
            this.setState({ activeTab: e.target.value });
        }
    };

    updateInfo = (value) => {
        this.setState((prevState) => ({
            info: [...prevState.info, value],  // Store all the messages in the array
        }));
    };

    render() {
        const { infixExpression, featureTab, activeTab, info } = this.state;
        return (
            <>
                <div className={css2["row"]}>
                    <div className={css2["mid-content"]}>
                        <div className={css2["visualization-container"]}>
                            <div className={css['visualization']}>
                                <div className={css['column']} id="symbolScanned">
                                    <h2>Symbol Scanned</h2>
                                    <div className={css['content']} ref={this.symbolScannedRef}></div>
                                </div>
                                <div className={css['column']} id="stack">
                                    <h2>Stack</h2>
                                    <div className={css['content']} ref={this.stackRef}></div>
                                </div>
                                <div className={css['column']} id="expression">
                                    <h2>Expression</h2>
                                    <div className={css['content']} ref={this.expressionRef}></div>
                                </div>
                            </div>
                        </div>
                        <div className={css2["feature-container"]}>
                            <div className={css2["tab-container"]} onClick={this.handleTabClick}>
                                <div className={`${css2['code-tab']} ${css2['tab']} ${css2[featureTab === 'Code' ? 'active' : '']}`}>
                                    <button value={'Code'}>Code</button>
                                </div>
                                <div className={`${css['Expression-tab']} ${css2['tab']} ${css2[`${featureTab === 'Expression' ? 'active' : ''}`]}`}>
                                    <button value={'Expression'} >Expression</button>
                                </div>
                            </div>
                            <div className={css2["selected-tab-content"]}>
                                {featureTab === 'Code' &&
                                    <div className={`${css2['code-Expression']} ${css2['active']}`}>
                                        <code>BST code</code>
                                    </div>
                                }
                                {featureTab === 'Expression' &&
                                    <div className={css["Expression"]}>
                                        <form onSubmit={this.startVisualization}>
                                            <input
                                                type="text"
                                                id="infixExpression"
                                                value={infixExpression}
                                                onChange={this.setExpression}
                                                placeholder="Enter infix expression"
                                            />
                                            <button type="submit">Run</button>
                                        </form>
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
                                <div className={`${css2['code-container']} ${css2['active']}`}>
                                    <code>code</code>
                                </div>
                            }
                            {
                                activeTab === 'Console' &&
                                <div className={css2["console"]}> 
                                    <div ref={this.consoleRef} className={css2["step-line"]}>
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
            </>
        );
    }
}

export default InfixToPostfix;
