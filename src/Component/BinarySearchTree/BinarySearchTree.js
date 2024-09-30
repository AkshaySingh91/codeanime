import React, { Component } from 'react'
import { BinaryTreeNode, drawBinaryTree, VisualizationType, setTheme } from 'binary-tree-visualizer';
import { SearchInBST, DeleteNodeFromBST, InsertInBst, TraverseInBST } from './BasicOperationInBST';


const TreeContext = React.createContext(null)

export class BinarySearchTree extends Component {
    constructor() {
        super()
        this.state = {
            nodes: [12, 23, 1, 23, 53, 68, 14, 10, 0, 13, 50],
            root: null,
            prevRoot: null,
            info: 'hello',
        }
        this.canvasRef = React.createRef()
    }
    componentDidMount = () => {
        let r = null
        const drawInitialTree = (root, key) => {
            if (!root) {
                return new BinaryTreeNode(key);
            }
            if (root && root.value === key) {
                return root;
            }
            if (root && key < root.value) {
                const left = drawInitialTree(root.left, key)
                root.setLeft(left);
            }
            else if (root && key > root.value) {
                const right = drawInitialTree(root.right, key)
                root.setRight(right);
            }
            return root;
        }
        for (let i = 0; i < this.state.nodes.length; i++) {
            r = drawInitialTree(r, this.state.nodes[i])
        }
        this.setState({ root: r })
    }
    componentDidUpdate() {
        const canvas = this.canvasRef.current;
        if (canvas !== undefined) {
            console.log(canvas.current)
            drawBinaryTree(this.state.root, canvas, {
                type: VisualizationType.HIGHLIGHT
            });
        } else {
            console.error("Canvas is not loaded")
        }
        setTheme({
            radius: 17,
            fontSize: 13,
            textFont: "Arial",
            colorArray: [{ bgColor: 'white', borderColor: 'black' }],
            strokeColor: 'white',
        })
    }

    highlightNode = (root, flag, bgColor = '#FABC3F', borderColor = '#E85C0D', time = 1000) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (flag)
                    root.nodeCircle.colorSettings = { bgColor, borderColor }
                else {
                    root.nodeCircle.radiusSettings.currentRadius += 5
                    root.nodeCircle.colorSettings = { bgColor, borderColor }
                }
                let canvas = this.canvasRef.current
                if (canvas) {
                    drawBinaryTree(this.state.root, canvas, {
                        type: VisualizationType.HIGHLIGHT
                    });
                } else {
                    console.error("Canvas is not loaded")
                }
                resolve();
            }, time);
        });
    };

    updateInfo = (value) => {
        this.setState({ info: value }, () => {
        })
    }
    updateRoot = (value) => {
        this.setState({ root: value }, () => {
        })
    }
    updateNodes = (value) => {
        this.setState({ nodes: value }, () => {
        })
    }
    render() {
        return (<>
            <canvas ref={this.canvasRef} ></canvas>
            <TreeContext.Provider value={{ info: this.state.info }}>
                <Features
                    root={this.state.root}
                    updateRoot={this.updateRoot}
                    highlightNode={this.highlightNode}
                    updateInfo={this.updateInfo}
                    updateNodes={this.updateNodes}
                    nodes={this.state.nodes}
                    canvas={this.canvasRef}
                ></Features>
            </TreeContext.Provider>
        </>)
    }
}



class Features extends Component {
    render() {
        const { root, updateRoot, updateInfo, highlightNode, updateNodes, nodes } = this.props
        return (<>
            <InsertInBst root={root} updateInfo={updateInfo} updateRoot={updateRoot} highlightNode={highlightNode} nodes={nodes} updateNodes={updateNodes} canvas={this.props.canvas} />

            <TraverseInBST root={this.props.root} highlightNode={this.props.highlightNode} updateInfo={updateInfo} />

            <SearchInBST root={this.props.root} highlightNode={this.props.highlightNode} updateInfo={updateInfo} />

            <DeleteNodeFromBST updateRoot={updateRoot} root={this.props.root} highlightNode={this.props.highlightNode} updateInfo={this.props.updateInfo} canvas={this.props.canvas} />

            <Text />

            <GenerateTrees updateRoot={updateRoot} updateNodes={updateNodes} />
        </>)
    }
}

class GenerateTrees extends Component {
    constructor() {
        super()
        this.state = {
            treeType: 'Generate random tree'
        }
    }
    getPerfectBinaryTree = () => {
        const { updateRoot, updateNodes } = this.props
        const buildBalancedBST = (arr, start, end) => {
            if (start > end) return null;
            let mid = Math.floor((start + end) / 2);
            let node = new BinaryTreeNode(arr[mid])

            node.left = buildBalancedBST(arr, start, mid - 1);
            node.right = buildBalancedBST(arr, mid + 1, end);
            return node;
        }

        const generateRandomBST = () => {
            const size = 15
            let values = [];
            while (values.length < size) {
                let num = Math.floor(Math.random() * 100);
                if (!values.includes(num)) {
                    values.push(num);
                }
            }
            values.sort((a, b) => a - b);
            updateNodes(values)

            return buildBalancedBST(values, 0, values.length - 1);
        }
        const newTree = generateRandomBST()
        updateRoot(newTree)
    }
    render() {
        return (<>
            <div className="input-group">
                <select defaultValue={this.state.treeType} className="custom-select" id="inputGroupSelect04"
                    onChange={(e) => {
                        this.setState({ treeType: e.target.value }, () => {
                            if (this.state.treeType === 'Perfect-binary-tree') {
                                this.getPerfectBinaryTree()
                            }
                            console.log(this.state.treeType)
                            this.setState({ treeType: 'Generate random tree' })
                        })
                    }}>
                    <option value={'Generate random tree'} disabled={true}>Generate random tree</option>
                    <option value={'Perfect-binary-tree'} >Perfect binary tree</option>
                    <option value={'Complete-binary-tree'} >Complete binary tree</option>
                </select>
            </div >
        </>)
    }
}

class Text extends Component {
    render() {
        return (<>
            <TreeContext.Consumer>
                {
                    ({ info }) => (
                        <p>{info}</p>
                    )
                }
            </TreeContext.Consumer>
        </>)
    }
}
export default BinarySearchTree
