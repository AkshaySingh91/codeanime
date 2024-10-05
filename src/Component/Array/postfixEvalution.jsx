import React, { Component, createRef } from 'react';
import css from './postfixEvaluation.module.css';

class PostfixEvaluation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            postfixExpression: '5 6 2 + * 12 4 / -', // default postfix expression
            currentStep: -1,
            stepsArray: [],
            activeTab: 'Code'
        };
        this.symbolScannedRef = createRef();
        this.stackRef = createRef();
        this.resultRef = createRef();
        this.consoleRef = createRef();
    }

    componentDidUpdate() {
        const { currentStep, stepsArray, isPaused, speed } = this.state;
        if (currentStep < stepsArray.length - 1 && !isPaused) {
            const timer = setTimeout(() => {
                this.visualizeNextStep();
            }, speed);
            return () => clearTimeout(timer);
        }
    }

    startEvaluation = (e) => {
        e.preventDefault();
        const { postfixExpression } = this.state;
        if (this.consoleRef.current) {
            this.consoleRef.current.innerHTML = '';
        }
        // Clear visual elements
        if (this.symbolScannedRef.current && this.stackRef.current && this.resultRef.current) {
            this.symbolScannedRef.current.innerHTML = '';
            this.stackRef.current.innerHTML = '';
            this.resultRef.current.innerHTML = '';
        }
        this.setState({ stepsArray: [] }, () => {
            this.setState({ currentStep: -1 }, () => {
                this.evaluatePostfix(postfixExpression);
            });
        });
    };

    setSteps = (value) => {
        this.setState(
            (prevState) => ({ stepsArray: [...prevState.stepsArray, value] }),
            () => {
                const currStep = this.state.stepsArray[this.state.stepsArray.length - 1];
                if (this.symbolScannedRef.current && this.stackRef.current && this.resultRef.current) {
                    const span1 = document.createElement('span');
                    span1.innerText = currStep.scanSymbol;

                    const stackSpanArr = [];
                    for (let i = 0; i < currStep.stack.length; i++) {
                        let span2 = document.createElement('span');
                        span2.innerText = currStep.stack[i];
                        stackSpanArr.push(span2);
                    }

                    this.symbolScannedRef.current.append(span1);
                    this.stackRef.current.innerHTML = '';
                    for (let i = 0; i < stackSpanArr.length; i++) {
                        this.stackRef.current.append(stackSpanArr[i]);
                    }
                    this.resultRef.current.innerText = currStep.result !== undefined ? `${currStep.result}` : '';
                }
            }
        );
    };

    evaluatePostfix = async (expression) => {
        const stack = [];
        const tokens = expression.split(' ');
        const { speed } = this.props;
        const delay = (time) => new Promise((resolve) => setTimeout(resolve, time / speed));
        for (const token of tokens) {
            if (!isNaN(token)) {
                // Token is a number, push it to the stack
                stack.push(parseInt(token));
                this.setSteps({ scanSymbol: token, stack: [...stack] });
                this.updateInfo(`Push ${token} into stack.`);
            } else {
                // Token is an operator, pop two operands and apply the operator
                const b = stack.pop();
                const a = stack.pop();
                let result;
                
                switch (token) {
                    case '+': result = a + b; break;
                    case '-': result = a - b; break;
                    case '*': result = a * b; break;
                    case '/': result = a / b; break;
                    case '%': result = a % b; break;
                    default: throw new Error(`Unknown operator: ${token}`);
                }
                this.updateInfo(`Pop  ${b} and ${a} from stack, push ${b}${token}${a} = ${result} in stack.`);
                stack.push(result);
                this.setSteps({ scanSymbol: token, stack: [...stack], result });
            }
            await delay(1000);
        }

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

    setExpression = (e) => {
        this.setState({ postfixExpression: e.target.value });
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
        const { activeTab, postfixExpression } = this.state;

        return (<>
            <div className="row">
                <div className="mid-content">
                    <div className="visualization-container">
                        <div className={css['container']}>
                            <div className={css['visualization']}>
                                <div className={css['column']} id="symbolScanned">
                                    <h2>Symbol Scanned</h2>
                                    <div className={css['content']} ref={this.symbolScannedRef}></div>
                                </div>
                                <div className={css['column']} id="stack">
                                    <h2>Stack</h2>
                                    <div className={css['content']} ref={this.stackRef}></div>
                                </div>
                                <div className={css['column']} id={`${css['result']}`}>
                                    <h2>Result</h2>
                                    <div className={css['content']} ref={this.resultRef}></div>
                                </div>
                            </div>
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
                        <div className={`Expression-tab tab ${activeTab === 'Expression' ? 'active' : ''}`}>
                            <button value={'Expression'} >Expression</button>
                        </div>
                    </div>
                    <div className="selected-tab-content">
                        {activeTab === 'Code' &&
                            <div className="code-Expression active">
                                <code>BST code</code>
                            </div>
                        }
                        {activeTab === 'Expression' &&
                            <div className={css['expression']}>
                                <form onSubmit={this.startEvaluation}>
                                    <input
                                        type="text"
                                        value={postfixExpression}
                                        onChange={this.setExpression}
                                        placeholder="Enter postfix expression"
                                    />
                                    <button type="submit">Run</button>
                                </form>
                            </div>
                        }
                    </div>
                </div>
            </div >
        </>);
    }
}
export default PostfixEvaluation;
