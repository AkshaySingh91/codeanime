import React, { Component, createRef } from 'react';
import css from './WellFormedParentheses.module.css';

class WellFormedParentheses extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputExpression: '({[()]})', // Default expression
            currentStep: -1,
            stepsArray: [],
            activeTab: 'Code',
            isValid: null, // Will track if the expression is well-formed or not
        };
        this.symbolScannedRef = createRef();
        this.stackRef = createRef();
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

    startCheck = (e) => {
        e.preventDefault();
        if (this.consoleRef.current) {
            this.consoleRef.current.innerHTML = ''
        }
        const { inputExpression } = this.state;

        // Clear visual elements
        if (this.symbolScannedRef.current && this.stackRef.current) {
            this.symbolScannedRef.current.innerHTML = '';
            this.stackRef.current.innerHTML = '';
        }

        this.setState({ stepsArray: [], isValid: null }, () => {
            this.setState({ currentStep: -1 }, () => {
                this.checkWellFormedness(inputExpression);
            });
        });
    };

    setSteps = (value) => {
        this.setState(
            (prevState) => ({ stepsArray: [...prevState.stepsArray, value] }),
            () => {
                const currStep = this.state.stepsArray[this.state.stepsArray.length - 1];
                if (this.symbolScannedRef.current && this.stackRef.current) {
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
                }
            }
        );
    };

    checkWellFormedness = async (expression) => {
        const stack = [];
        const matchingPairs = { ')': '(', ']': '[', '}': '{' };
        const { speed } = this.props;
        const delay = (time) => new Promise((resolve) => setTimeout(resolve, time / speed));

        for (const char of expression) {
            if (['(', '[', '{'].includes(char)) {
                // If an opening bracket is found, push it to the stack
                stack.push(char);
                this.updateInfo(`push ${char} into stack.`);
                this.setSteps({ scanSymbol: char, stack: [...stack] });
            } else if ([')', ']', '}'].includes(char)) {
                // If a closing bracket is found, check if it matches the top of the stack
                if (stack.length === 0 || stack[stack.length - 1] !== matchingPairs[char]) {
                    if (stack.length === 0) {
                        this.updateInfo(`Extra ${char} bracket in expression.`);
                    } else {
                        this.updateInfo(`${char} bracket does not match.`);
                    }
                    this.setSteps({ scanSymbol: char, stack: [...stack] });
                    this.setState({ isValid: false });
                    return;
                }
                this.updateInfo(`pop ${char} from stack.`);
                stack.pop(); // Pop the matching opening bracket
                this.setSteps({ scanSymbol: char, stack: [...stack] });
            }
            await delay(1000);
        }

        // If the stack is empty after processing all symbols, it's well-formed
        if (stack.length === 0) {
            this.setState({ isValid: true });
        } else {
            this.setState({ isValid: false });
            this.updateInfo(`Extra opening bracket in expression.`);
        }

        // Start visualization
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
        this.setState({ inputExpression: e.target.value });
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
        const { inputExpression, isValid, activeTab } = this.state;
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
                            </div>
                            {isValid !== null && (
                                <div className={css['result']} id="stack">
                                    <div className={css['content']}>
                                        Result:
                                        <span>
                                            {isValid ? 'The expression is well-formed!' : 'The expression is not well-formed!'}
                                        </span>
                                    </div>
                                </div>
                            )}

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
                                <form onSubmit={this.startCheck}>
                                    <input
                                        type="text"
                                        value={inputExpression}
                                        onChange={this.setExpression}
                                        placeholder="Enter expression with parentheses"
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

export default WellFormedParentheses;
