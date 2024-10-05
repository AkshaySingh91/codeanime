import React, { Component } from 'react'

import InfixToPostfix from "./component/InfixToPostfix"


export default class App extends Component{
  constructor(){
    super()
    console.log("constructor")
  }
  render(){
    return(
      <>
       <InfixToPostfix></InfixToPostfix>
      </>
    )
  }
}
