import React, { Component } from 'react'
import BinarySearchTree from './Component/BinarySearchTree/BinarySearchTree'
import TreeVisualization from './Component/HeapBinaryTree/HeapBinaryTree'
import Card from './Component/Card'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './App.css'
import BinaryTreeAnimation from './Component/Assets/BinaryTreeAnimation';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      algorithmCard: [
        {
          name: 'Binary Search Tree',
          description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas, provident. Amet excepturi et beatae illum tempora maxime, tenetur adipisci possimus minima ad quia a aliquid, animi sunt quae cupiditate iusto?',
          imageUrl: "https://static.javatpoint.com/ds/images/binary-search-tree1.png",
          path: 'BinarySearchTree'
        },
        {
          name: 'Heap',
          description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas, provident. Amet excepturi et beatae illum tempora maxime, tenetur adipisci possimus minima ad quia a aliquid, animi sunt quae cupiditate iusto?',
          imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrFv2JWdBEzNIhcsZ1GdoZK8m6puFG3c1D9g&s",
          path: 'HeapBinaryTree'
        },
        {
          name: 'Linked list',
          description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas, provident. Amet excepturi et beatae illum tempora maxime, tenetur adipisci possimus minima ad quia a aliquid, animi sunt quae cupiditate iusto?',
          imageUrl: 'https://codeforwin.org/wp-content/uploads/2015/09/Linked-list-nodes.png'
        },
      ]
    }
  }
  render() {
    return (<>

      <Router>
        <Routes>
          <Route exact path='/' element={
            <HomePage algorithmCard={this.state.algorithmCard} />
          }></Route>
          <Route exact path='/BinarySearchTree'
            element={
              <BinarySearchTree />
            }
          ></Route>
          <Route exact path='/HeapBinaryTree'
            element={
              <TreeVisualization />
            }>
          </Route>
        </Routes>
      </Router>
    </>)
  }

}
export class HomePage extends Component {
  render() {
    const { algorithmCard } = this.props;
    return (<>
      <section className="hero-section">
        <div className="hero-content">
          <h1>Binary Tree</h1>
          <p>A Binary Tree is a hierarchical data structure in which each node has at most two children: a left child and a right child. Binary trees are widely used in computer science for efficient searching, sorting, and hierarchical data management.</p>
          <div className="buttons">
            <a href="#" className="play-btn">
              <i className='fa fa-play' />
            </a>
          </div>
          {/* <div className="hero-slider">
            <div className="slider">
              <div className="slide"><img src="image1.jpg" alt="Animal Image 1" /><p>Name Slider<br />Description</p></div>
              <div className="slide"><img src="image2.jpg" alt="Animal Image 2" /><p>Name Slider<br />Description</p></div>
              <div className="slide"><img src="image3.jpg" alt="Animal Image 3" /><p>Name Slider<br />Description</p></div>
            </div>
          </div> */}
        </div>
        <div className="svgContainer">
          <BinaryTreeAnimation />
        </div>
      </section>

    </>)
  }
}

{/* <div className="container d-flex">
    {
      algorithmCard.map((card) => {
        return (
          <Card key={card.name}
           path={card.path}
            imageUrl={card.imageUrl}
            name={card.name}
            description={card.description} />
        );
      })
    } 
  </div> */}