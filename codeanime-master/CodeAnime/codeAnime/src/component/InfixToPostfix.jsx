import React, { Component } from 'react';

export class InfixToPostfix extends Component {
  constructor(props) {
    super(props);
    this.state = {
      steps: [],
      currentStep: -1,
      speed: 1000,
      infixExpression: '',
    };
  } 

  startVisualization = () => {
    const { infixExpression } = this.state;
    
    this.setState({ steps: [], currentStep: -1 }, () => {
      this.convertToPostfix(infixExpression);
      this.visualizeNextStep();
    });
  }

  refreshPage = () => {
    window.location.reload();
  }

  convertToPostfix = (expression) => {
    console.log(expression)
    const stack = [];
    const output = [];
    const precedence = { '+': 1, '-': 1, '*': 2, '/': 2, '%' : 2, '^': 3 };
    const operators = new Set(['+', '-', '*', '/', '^', '%']);
    const steps = [];

    for (const char of expression) {
      if (/[A-Za-z0-9]/.test(char)) {
        output.push(char);
        steps.push({ symbol: char, stack: stack.slice(), expression: output.join('') });
      } else if (char === '(') {
        stack.push(char);
        steps.push({ symbol: char, stack: stack.slice(), expression: output.join('') });
      } else if (char === ')') {
        while (stack.length && stack[stack.length - 1] !== '(') {
          output.push(stack.pop());
          steps.push({ symbol: char, stack: stack.slice(), expression: output.join('') });
          this.visualizeNextStep()
        }
        stack.pop(); // remove '('
        steps.push({ symbol: char, stack: stack.slice(), expression: output.join('') });
      } else if (operators.has(char)) {
        while (stack.length && precedence[stack[stack.length - 1]] >= precedence[char]) {
          output.push(stack.pop());
          steps.push({ symbol: char, stack: stack.slice(), expression: output.join('') });
          this.visualizeNextStep()
        }
        stack.push(char);
        steps.push({ symbol: char, stack: stack.slice(), expression: output.join('') });
      }
      // this.visualizeNextStep()
    }
    // console.log(output, steps)
    while (stack.length) {
      output.push(stack.pop());
      steps.push({ symbol: ' ', stack: stack.slice(), expression: output.join('') });
    }

    this.setState({ steps });
  }

  visualizeNextStep = () => {
    const { steps, currentStep, speed } = this.state;
    if (currentStep < steps.length - 1) {
      console.log(steps)
      this.setState({ currentStep: currentStep + 1 }, () => {
        this.updateVisualization(steps[this.state.currentStep]);
        setTimeout(this.visualizeNextStep, speed);
      });
    }
  }

  updateVisualization = (step) => {
    const symbolScanned = document.getElementById('symbolScanned').querySelector('.content');
    const stack = document.getElementById('stack').querySelector('.content');
    const expression = document.getElementById('expression').querySelector('.content');

    symbolScanned.innerHTML += `<div class="row"><div>${step.symbol}</div></div><hr>`;
    stack.innerHTML = '';
    step.stack.forEach(item => {
      stack.innerHTML = `<div class="stack-enter">${item}</div>` + stack.innerHTML;
    });
    expression.innerHTML += `<div class="row"><div>${step.expression}</div></div><hr>`;
  }

  undo = () => {
    if (this.state.currentStep > 0) {
      this.setState({ currentStep: this.state.currentStep - 1 }, () => {
        this.updateVisualization(this.state.steps[this.state.currentStep]);
      });
    }
  }

  redo = () => {
    if (this.state.currentStep < this.state.steps.length - 1) {
      this.setState({ currentStep: this.state.currentStep + 1 }, () => {
        this.updateVisualization(this.state.steps[this.state.currentStep]);
      });
    }
  }

  handleSpeedChange = (e) => {
    this.setState({ speed: 10000 / e.target.value });
  }

  handleInputChange = (e) => { 
    this.setState({ infixExpression: e.target.value }, ()=>{
    });
  }

  render() {
    return (
      <>
        <div className="container">
          <h1>Infix to Postfix Expression Visualizer</h1>
          <input 
            type="text" 
            id="infixExpression" 
            placeholder="Enter infix expression" 
            value={this.state.infixExpression}
            onChange={this.handleInputChange}
          />
          <button onClick={this.startVisualization}>Run</button>
          <button onClick={this.refreshPage}>Refresh</button>
          <button onClick={this.undo}>Undo</button>
          <button onClick={this.redo}>Redo</button>

          <label htmlFor="speedControl">Speed:</label>
          <input 
            type="range" 
            id="speedControl" 
            min="1" 
            max="10" 
            defaultValue="5" 
            onChange={this.handleSpeedChange}
          />

          <div className="visualization">
            <div className="column" id="symbolScanned">
              <h2>Symbol Scanned</h2>
              <div className="content"></div>
            </div>
            <div className="column" id="stack">
              <h2>Stack</h2>
              <div className="content"></div>
            </div>
            <div className="column" id="expression">
              <h2>Expression</h2>
              <div className="content"></div>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default InfixToPostfix;
