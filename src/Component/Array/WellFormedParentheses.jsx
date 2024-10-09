import React, { Component, createRef } from 'react';
import css from '../visualizationPage/index.module.css';
import css2 from './WellFormedParentheses.module.css';
import { Editor } from '@monaco-editor/react';
import { ThemeContext } from '../../Datastore/Context';

const codeToDisplay = `function isWellFormed(expression) {\n\
    const stack = [];\n\
    const matchingParentheses = {')': '(', '}': '{', ']': '['};\n\
    for (let i = 0; i < expression.length; i++) {\n\
        const char = expression[i];\n\
        if (['(', '{', '['].includes(char)) {\n\
            stack.push(char);\n\
        } else if ([')', '}', ']'].includes(char)) {\n\
            if (stack.isEmpty() || stack.pop() !== matchingParentheses[char]) {\n\
                return false;\n\
            }\n\
        }\n\
    }\n\
    return stack.isEmpty();\n\
}`;


class WellFormedParentheses extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputExpression: '({[()]})', // Default expression
            currentStep: -1,
            stepsArray: [],
            featureTab: 'Expression',
            activeTab: 'Console',
            isValid: null, // Will track if the expression is well-formed or not
            isPaused: false, // Used for controlling visualization
            speed: 1, // Speed control
        };
        this.symbolScannedRef = createRef();
        this.stackRef = createRef();
        this.consoleRef = createRef();
        this.isPlayingRef = createRef();
    }
    checkIsPlaying = async () => {
        while (this.isPlayingRef.current === 'pause') {
            await new Promise(resolve => setTimeout(resolve, 100)); // Poll every 100ms
        }
    };

    componentDidUpdate(prevProps, prevState) {
        console.log(prevProps.isPlaying , this.props.isPlaying)
        if (prevProps.isPlaying !== this.props.isPlaying) {
            this.isPlayingRef.current = this.props.isPlaying;
        }
        const { currentStep, stepsArray, isPaused, speed } = this.state;
        if (currentStep < stepsArray.length - 1 && !isPaused) {
            const timer = setTimeout(() => {
                this.visualizeNextStep();
            }, 1000 / speed); // Adjust speed here
            return () => clearTimeout(timer);
        }
    }

    startCheck = (e) => {
        e.preventDefault(); // Prevent page reload
        if (this.consoleRef.current) {
            this.consoleRef.current.innerHTML = '';
        }
        const { inputExpression } = this.state;

        // Clear visual elements
        if (this.symbolScannedRef.current && this.stackRef.current) {
            this.symbolScannedRef.current.innerHTML = '';
            this.stackRef.current.innerHTML = '';
        }

        this.setState({ stepsArray: [], isValid: null, isPaused: false }, () => {
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
            await this.checkIsPlaying();
            if (['(', '[', '{'].includes(char)) {
                // If an opening bracket is found, push it to the stack
                stack.push(char);
                this.updateInfo(`push <b>${char}</b> into stack.`);
                this.setSteps({ scanSymbol: char, stack: [...stack] });
            } else if ([')', ']', '}'].includes(char)) {
                // If a closing bracket is found, check if it matches the top of the stack
                if (stack.length === 0 || stack[stack.length - 1] !== matchingPairs[char]) {
                    if (stack.length === 0) {
                        this.updateInfo(`Extra <b>${char}</b> bracket in expression.`);
                    } else {
                        this.updateInfo(`<b>${char}</b> bracket does not match.`);
                    }
                    this.setSteps({ scanSymbol: char, stack: [...stack] });
                    this.setState({ isValid: false });
                    return;
                }
                this.updateInfo(`pop <b>${char}</b> from stack.`);
                stack.pop(); // Pop the matching opening bracket
                this.setSteps({ scanSymbol: char, stack: [...stack] });
            }
            await delay(1000 / speed);
        }

        // If the stack is empty after processing all symbols, it's well-formed
        if (stack.length === 0) {
            this.setState({ isValid: true });
        } else {
            this.setState({ isValid: false });
            this.updateInfo(`<b>Extra opening bracket in expression.</b>`);
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
        });
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

    render() {
        const { inputExpression, isValid, featureTab, activeTab } = this.state;
        return (
            <>
                <div className={css['row']}>
                    <div className={css['mid-content']}>
                        <div className={css['visualization-container']}>
                            <div className={css['container']}>
                                <div className={css2['visualization']}>
                                    <div className={css2['column']} id="symbolScanned">
                                        <h2>Symbol Scanned</h2>
                                        <div className={css2['content']} ref={this.symbolScannedRef}></div>
                                    </div>
                                    <div className={css2['column']} id="stack">
                                        <h2>Stack</h2>
                                        <div className={css2['content']} ref={this.stackRef}></div>
                                    </div>
                                </div>
                                {isValid !== null && (
                                    <div className={css2['result']} id="stack">
                                        <div className={css2['content']}>
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
                        <div className={css['feature-container']}>
                            <div className={css['tab-container']} onClick={this.handleTabClick}>
                                <div
                                    className={`${css['Expression-tab']} ${css['tab']} ${css[`${featureTab === 'Expression' ? 'active' : ''}`]}`}
                                >
                                    <button value={'Expression'}>Expression</button>
                                </div>
                            </div>
                            <div className={css['selected-tab-content']}>
                                {featureTab === 'Expression' && (
                                    <div className={css['Expression']}>
                                        <form onSubmit={this.startCheck}>
                                            <input
                                                type="text"
                                                id="infixExpression"
                                                value={inputExpression}
                                                onChange={this.setExpression}
                                                placeholder="Enter infix expression"
                                            />
                                            <button type="submit">Run</button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={css['text-container']}>
                        <div className={css[`${'right-tab-container'}`]} onClick={this.handleRightTabClick}>
                            <div className={`${css['Console-tab']} ${css['tab']} ${css[`${activeTab === 'Console' ? 'active' : ''}`]}`}>
                                <button value={'Console'}>Console</button>
                            </div>
                            <div className={`${css['Code-tab']} ${css['tab']} ${css[`${activeTab === 'Code' ? 'active' : ''}`]}`}>
                                <button value={'Code'}>Code</button>
                            </div>
                        </div>

                        <div className={css['right-selected-tab-content']}>
                            {activeTab === 'Code' && (
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
                                    </ThemeContext.Consumer>
                                </div>
                            )}
                            {activeTab === 'Console' && (
                                <div className={css['console']}>
                                    <span className={css['header']}></span>
                                    <div ref={this.consoleRef} className={css['step-line']}></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default WellFormedParentheses;
