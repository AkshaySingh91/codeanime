import React, { Component } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './App.css';
import { AlgorithmPage } from './Component/algorithmPage/AlgorithmPage'
import Card from './Component/Card';
import { algorithmCard } from './Datastore/algoritmInfo';
import BinarySearchTree from './Component/BinarySearchTree/BinarySearchTree';

export default class App extends Component {
  constructor() {
    super();
  }
  render() {
    return (<>

      <Router>
        <Routes>
          <Route exact path='/' element={
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
            element={<BinarySearchTree />}
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

