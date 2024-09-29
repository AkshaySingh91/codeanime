import React, { Component } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AlgorithmPage } from './Component/algorithmPage/AlgorithmPage'
import Card from './Component/Card';
import { algorithmCard } from './Datastore/algoritmInfo';
import AlgorithmVisualization from './Component/visualizationPage';
import './App.css';

export default class App extends Component {
  render() {
    return (<>

      <Router>
        <Routes>
          <Route exact path='/'
            element={
              <HomePage algorithmCard={algorithmCard} />
            }></Route>
          <Route exact path='/BinaryTree'
            element={
              <AlgorithmPage path={'BinaryTree'} algorithmCard={algorithmCard} />
            }></Route>
          <Route exact path='/HeapBinaryTree'
            element={
              <AlgorithmPage algorithmCard={algorithmCard} />
            }></Route>
          <Route exact path='/BinaryTree/algorithm'
            element={<AlgorithmVisualization />}
          ></Route>
        </Routes>
      </Router>
    </>)
  }

}

export class HomePage extends Component {
  render() {
    const { algorithmCard } = this.props;
    return (
      <>
        <div className="algorithmList">
          <div className="algorithm-grid">
            {
              algorithmCard.map((algo) => {
                return (
                  <Card key={algo.path} path={algo.path}
                    name={algo.name}
                    previewSvg={algo.previewSvg}
                  />
                )
              })
            }
          </div>
        </div >
      </>
    )
  }
}


