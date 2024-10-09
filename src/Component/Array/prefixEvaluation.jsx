import React, { Component, createRef } from 'react';
import css from './prefixEvaluation.module.css';
import css2 from '../visualizationPage/index.module.css';
import { Editor } from '@monaco-editor/react';
import { ThemeContext } from '../../Datastore/Context';

const codeToDisplay = `function evaluatePrefix(expression) {\n\
    let stack = [];\n\
    const tokens = expression.split(' ').reverse();\n\
    for (const token of tokens) {\n\
        if (!isNaN(token)) {\n\
            stack.push(Number(token));\n\
        } else {\n\
            const a = stack.pop();\n\
            const b = stack.pop();\n\
            let result;\n\
            switch (token) {\n\
                case '+': result = a + b; break;\n\
                case '-': result = a - b; break;\n\
                case '*': result = a * b; break;\n\
                case '/': result = a / b; break;\n\
            }\n\
            stack.push(result);\n\
        }\n\
    }\n\
    return stack.pop();\n\
}`;

class PrefixEvaluation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            prefixExpression: '+ 5 * 6 2 - 12 4', // default prefix expression
            currentStep: -1,
            stepsArray: [],
            featureTab: 'Expression',
            activeTab: 'Console',
        };
        this.symbolScannedRef = createRef();
        this.stackRef = createRef();
        this.resultRef = createRef();
        this.consoleRef = createRef();
        this.isPlayingRef = createRef();
    }

    checkIsPlaying = async () => {
        while (this.isPlayingRef.current === 'pause') {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    };

    componentDidUpdate(prevProps) {
        const { currentStep, stepsArray, isPaused, speed } = this.state;
        if (currentStep < stepsArray.length - 1 && !isPaused) {
            const timer = setTimeout(() => {
                this.visualizeNextStep();
            }, speed);
            return () => clearTimeout(timer);
        }
        if (prevProps.isPlaying !== this.props.isPlaying) {
            this.isPlayingRef.current = this.props.isPlaying;
        }
    }

    startEvaluation = (e) => {
        e.preventDefault();
        const { prefixExpression } = this.state;
        if (this.consoleRef.current) {
            this.consoleRef.current.innerHTML = '';
        }
        if (this.symbolScannedRef.current && this.stackRef.current && this.resultRef.current) {
            this.symbolScannedRef.current.innerHTML = '';
            this.stackRef.current.innerHTML = '';
            this.resultRef.current.innerHTML = '';
        }
        this.setState({ stepsArray: [] }, () => {
            this.setState({ currentStep: -1 }, () => {
                this.evaluatePrefix(prefixExpression);
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

    evaluatePrefix = async (expression) => {
        const stack = [];
        const tokens = expression.split(' ').reverse();
        const { speed } = this.props;
        const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));
        for (const token of tokens) {
            await this.checkIsPlaying();
            if (!isNaN(token)) {
                stack.push(parseInt(token));
                this.setSteps({ scanSymbol: token, stack: [...stack] });
                this.updateInfo(`Push <b>${token}</b> into stack.`);
            } else {
                const a = stack.pop();
                const b = stack.pop();
                let result;

                switch (token) {
                    case '+': result = a + b; break;
                    case '-': result = a - b; break;
                    case '*': result = a * b; break;
                    case '/': result = a / b; break;
                    default: throw new Error(`Unknown operator: ${token}`);
                }
                this.updateInfo(`Pop ${a} and ${b} from stack, push <b>${token} ${a} ${b} = ${result}</b> in stack.`);
                stack.push(result);
                this.setSteps({ scanSymbol: token, stack: [...stack], result });
            }
            await delay(1000 / speed);
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
        this.setState({ prefixExpression: e.target.value });
    };

    handleTabClick = (e) => {
        if (e.target.tagName === 'BUTTON') {
            this.setState({ featureTab: e.target.value });
        }
    }

    updateInfo = (value) => {
        this.setState({ info: value }, () => {
            if (this.consoleRef.current) {
                const span = document.createElement('span');
                span.innerHTML = value;
                this.consoleRef.current.append(span);
            }
        });
    }

    handleRightTabClick = (e) => {
        if (e.target.tagName === 'BUTTON') {
            this.setState({ activeTab: e.target.value });
        }
    }

    render() {
        const { featureTab, activeTab, prefixExpression } = this.state;

        return (
            <>
                <div className={css2["row"]}>
                    <div className={css2["mid-content"]}>
                        <div className={css2["visualization-container"]}>
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
                                        <div className={css['content']}>
                                            <span ref={this.resultRef}></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={css2["feature-container"]}>
                            <div className={css2["tab-container"]} onClick={this.handleTabClick}>
                                <div className={`${css['Expression-tab']} ${css2['tab']} ${css2[`${featureTab === 'Expression' ? 'active' : ''}`]}`}>
                                    <button value={'Expression'}>Expression</button>
                                </div>
                            </div>
                            <div className={css2["selected-tab-content"]}>
                                {featureTab === 'Expression' &&
                                    <div className={css['Expression']}>
                                        <form onSubmit={this.startEvaluation}>
                                            <input
                                                type="text"
                                                value={prefixExpression}
                                                onChange={this.setExpression}
                                                placeholder="Enter prefix expression"
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
                                <button value={'Console'}>Console</button>
                            </div>
                            <div className={`${css2['Code-tab']} ${css2['tab']} ${css2[`${activeTab === 'Code' ? 'active' : ''}`]}`}>
                                <button value={'Code'}>Code</button>
                            </div>
                        </div>

                        <div className={css2["right-selected-tab-content"]}>
                            {activeTab === 'Code' &&
                                <div className={`${css['code-container']} ${css['active']}`}>
                                    <ThemeContext.Consumer>
                                        {({ theme = 'light' }) => (
                                            <Editor
                                                className={css['editor']}
                                                language='javascript'
                                                onMount={this.handleEditorDidMount}
                                                value={codeToDisplay}
                                                options={{
                                                    padding: {
                                                        top: '10',
                                                        left: '0',
                                                        bottom: '10'
                                                    },
                                                    minimap: { enabled: false },
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
                            {activeTab === 'Console' &&
                                <div className={css2["console"]}>
                                    <span className={css2["header"]}></span>
                                    <div ref={this.consoleRef} className={css2["step-line"]}></div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
export default PrefixEvaluation;
