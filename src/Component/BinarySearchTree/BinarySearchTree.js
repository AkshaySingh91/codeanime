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
            activeTab: 'Code'
        }
        this.canvasRef = React.createRef();
        this.consoleRef = React.createRef();
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
            if (this.consoleRef.current) {
                const span = document.createElement('span');
                span.innerHTML = value;
                this.consoleRef.current.append(span);
            }
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
    handleTabClick = (e) => {
        if (e.target.tagName === 'BUTTON') {
            this.setState({ activeTab: e.target.value })
        }
    }
    render() {
        const { activeTab } = this.state
        const { speed, isPlaying } = this.props;
        return (<>
            <TreeContext.Provider value={{ info: this.state.info }}>
                <div className="row">
                    <div className="mid-content">
                        <div className="visualization-container">
                            <div className="svg-area">
                                <canvas ref={this.canvasRef} ></canvas>
                            </div>
                        </div>
                        {/* step Display */}
                        <div className="text-container">
                            <div className="console">
                                <span className='header'>Console</span>
                                <div ref={this.consoleRef} className="step-line">
                                    <Text />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="right-panel">
                        <div className="tab-container" onClick={this.handleTabClick}>
                            <div className={`code-tab  tab ${activeTab === 'Code' ? 'active' : ''}`}>
                                <button value={'Code'}>code</button>
                            </div>
                            <div className={`Insert-tab tab ${activeTab === 'Insert' ? 'active' : ''}`}>
                                <button value={'Insert'} >Insert</button>
                            </div>
                            <div className={`Search-tab tab ${activeTab === 'Search' ? 'active' : ''}`}>
                                <button value={'Search'} >Search</button>
                            </div>
                            <div className={`Delete-tab tab ${activeTab === 'Delete' ? 'active' : ''}`}>
                                <button value={'Delete'} >Delete</button>
                            </div>
                            <div className={`Traverse-tab tab ${activeTab === 'Traverse' ? 'active' : ''}`}>
                                <button value={'Traverse'} >Traverse</button>
                            </div>
                            <div className={`GenerateTree-tab tab ${activeTab === 'GenerateTree' ? 'active' : ''}`}>
                                <button value={'GenerateTree'} >GenerateTree</button>
                            </div>
                        </div>
                        <div className="selected-tab-content">
                            {activeTab === 'Code' &&
                                <div className="code-container active">
                                    <code>BST code</code>
                                </div>
                            }
                            {activeTab === 'Insert' &&
                                <div className="insert">
                                    <InsertInBst root={this.state.root} updateInfo={this.updateInfo} updateRoot={this.updateRoot} highlightNode={this.highlightNode} nodes={this.state.nodes} updateNodes={this.updateNodes} canvas={this.canvasRef} consoleRef={this.consoleRef} speed={speed} isPlaying={isPlaying} />
                                </div>
                            }
                            {activeTab === 'Traverse' &&
                                <div className="traverse">
                                    <TraverseInBST root={this.state.root} highlightNode={this.highlightNode} updateInfo={this.updateInfo} consoleRef={this.consoleRef} speed={speed} isPlaying={isPlaying} />
                                </div>
                            }
                            {activeTab === 'Search' &&
                                <div className="search">
                                    <SearchInBST root={this.state.root} highlightNode={this.highlightNode} updateInfo={this.updateInfo} consoleRef={this.consoleRef} speed={speed} isPlaying={isPlaying} />
                                </div>
                            }
                            {activeTab === 'Delete' &&
                                <div className="delete">
                                    <DeleteNodeFromBST updateRoot={this.updateRoot} root={this.state.root} highlightNode={this.highlightNode} updateInfo={this.updateInfo} canvas={this.canvasRef} consoleRef={this.consoleRef} speed={speed} isPlaying={isPlaying} />
                                </div>
                            }
                            {activeTab === 'GenerateTree' &&
                                <div className="generateTree">
                                    <GenerateTrees updateRoot={this.updateRoot} updateNodes={this.updateNodes} consoleRef={this.consoleRef} />
                                </div>
                            }
                        </div>
                    </div>
                </div >
            </TreeContext.Provider >
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
                        <span>{info}</span>
                    )
                }
            </TreeContext.Consumer>
        </>)
    }
}
export default BinarySearchTree
