import React, { Component } from 'react'
import { CreateBinaryHeap, insertByLevelrorder } from "./BasicOperationInHeap"
import * as  d3 from "d3"

export class HeapBinaryTree extends Component {
    constructor() {
        super()
        this.state = {
            root: null,
            flattenTree: [{}],
            info: '',
            treeType: 'min',
            mode: 'Binary Tree Mode'
        }
        this.svgRef = React.createRef()
        this.CreateBinaryHeapRef = React.createRef()
    }
    componentDidMount() {
        const createBinaryHeapComponent = this.CreateBinaryHeapRef.current.FeaturesRef.current
        if (createBinaryHeapComponent) {
            // Define the number of runs for the test data generated
            const maxValueInNode = 100, maxNoOfNode = 20, minNoOfNode = 6;
            const getRandomInt = (min, max) => {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
            const noOfNode = getRandomInt(minNoOfNode, maxNoOfNode);
            const randomSortedArr = [];
            for (let j = 0; j < noOfNode; j++) {
                randomSortedArr.push(getRandomInt(0, maxValueInNode));
            }
            randomSortedArr.sort((a, b) => a - b); 
            // give all node id bec it is req in heap sort
            let nodeCount = 1;
            let initialRoot = null, nodeWithId = []
            for (let i=0; i<randomSortedArr.length; i++) {
                nodeWithId.push({'value': i, 'id': nodeCount})
                initialRoot = insertByLevelrorder(initialRoot, i, nodeCount)
                nodeCount++;
            } 
            this.setState({flattenTree: nodeWithId})
            initialRoot = d3.hierarchy(initialRoot)
            this.setState({root : initialRoot})
            createBinaryHeapComponent.drawTree(initialRoot)
        }

    }
    updateRoot = (value) => {
        this.setState({ root: value })
    }
    updateFlattenTree = (value) => {
        this.setState({ flattenTree: value })
    }
    updateInfo = (value) => {
        this.setState({ info: value })
    }
    updateTreeType = (value) => {
        this.setState({ treeType: value })
    }
    updateMode = (value)=>{
        this.setState({mode: value})
    }
    render() {
        const { root, flattenTree, info, treeType, mode} = this.state
        return (<>
            <svg ref={this.svgRef} width="80vw" height="400"></svg>
            <Features
                root={root}
                flattenTree={flattenTree}
                updateRoot={this.updateRoot}
                updateFlattenTree={this.updateFlattenTree}
                svgRef={this.svgRef}
                updateInfo={this.updateInfo}
                info={info}
                treeType={treeType}
                updateTreeType={this.updateTreeType}
                ref={this.CreateBinaryHeapRef}
                mode={mode}
                updateMode={this.updateMode}
            />
        </>)

    }
}

class Features extends Component {
    constructor() {
        super()
        this.FeaturesRef = React.createRef()
    }
    render() {
        const { root, flattenTree, updateRoot, updateInfo, updateFlattenTree, svgRef, info, treeType, updateTreeType, mode, updateMode } = this.props
        return (<>
            <div className="container"  >
                <div className="form-check">
                    <input onChange={(e) => {
                        updateTreeType('min')
                    }}
                        defaultChecked={true} value={'min'} className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                    <label className="form-check-label" htmlFor="flexRadioDefault1">
                        Min Heap
                    </label>
                </div>
                <div className="form-check">
                    <input onChange={(e) => {
                        updateTreeType('max')
                    }}
                        value={"max"} className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                    <label className="form-check-label" htmlFor="flexRadioDefault2">
                        Max Heap
                    </label>
                </div>
            </div>
            <CreateBinaryHeap
                root={root}
                flattenTree={flattenTree}
                updateRoot={updateRoot}
                updateFlattenTree={updateFlattenTree}
                svgRef={svgRef}
                updateInfo={updateInfo}
                treeType={treeType}
                ref={this.FeaturesRef}
                mode={mode}
                updateMode={updateMode}
            />
            <ShowInfo info={info} />
        </>)
    }
}

class ShowInfo extends Component {
    render() {
        const { info } = this.props
        return (<>
            <p>{info}</p>
        </>)
    }
}
export default HeapBinaryTree
