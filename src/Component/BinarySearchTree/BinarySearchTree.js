import React, { Component } from 'react'
import { BinaryTreeNode, drawBinaryTree, VisualizationType, setTheme } from 'binary-tree-visualizer';
import { SearchInBST, DeleteNodeFromBST, InsertInBst, TraverseInBST, GenerateTrees } from './BasicOperationInBST';
import css from '../visualizationPage/index.module.css'

const TreeContext = React.createContext(null)

export class BinarySearchTree extends Component {
    constructor() {
        super()
        this.state = {
            nodes: [12, 23, 1, 23, 53, 68, 14, 10, 0, 13, 50],
            root: null,
            prevRoot: null,
            info: 'hello',
            featureTab: 'Insert',
            activeTab: 'Console',
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
            this.setState({ featureTab: e.target.value })
        }
    }
    handleRightTabClick = (e) => {
        if (e.target.tagName === 'BUTTON') {
            this.setState({ activeTab: e.target.value })
        }
    }
    render() {
        const { featureTab, activeTab } = this.state
        const { speed, isPlaying } = this.props;
        console.log(activeTab)
        return (<>
            <TreeContext.Provider value={{ info: this.state.info }}>
                <div className={css[`${"row"}`]}>
                    <div className={css[`${"mid-content"}`]}>
                        <div className={css[`${"visualization-container"}`]}>
                            <div className={css[`${"svg-area"}`]}>
                                <canvas ref={this.canvasRef} ></canvas>
                            </div>
                        </div>
                        {/* step Display */}
                        <div className={css[`${"feature-container"}`]}>
                            <div className={css[`${"tab-container"}`]} onClick={this.handleTabClick}>

                                <div className={`${css['Insert-tab']} ${css['tab']} ${css[`${featureTab === 'Insert' ? 'active' : ''}`]}`}>
                                    <button value={'Insert'} >Insert</button>
                                </div>
                                <div className={`${css['Search-tab']} ${css['tab']} ${css[`${featureTab === 'Search' ? 'active' : ''}`]}`}>
                                    <button value={'Search'} >Search</button>
                                </div>
                                <div className={`${css['Delete-tab']} ${css['tab']} ${css[`${featureTab === 'Delete' ? 'active' : ''}`]}`}>
                                    <button value={'Delete'} >Delete</button>
                                </div>
                                <div className={`${css['Traverse-tab']} ${css['tab']} ${css[`${featureTab === 'Traverse' ? 'active' : ''}`]}`}>
                                    <button value={'Traverse'} >Traverse</button>
                                </div>
                                <div className={`${css['GenerateTree-tab']} ${css['tab']} ${css[`${featureTab === 'GenerateTree' ? 'active' : ''}`]}`}>
                                    <button value={'GenerateTree'} >GenerateTree</button>
                                </div>
                            </div>
                            <div className={css[`${"selected-tab-content"}`]}>
                                {featureTab === 'Insert' &&
                                    <div className={css[`${"insert"}`]}>
                                        <InsertInBst root={this.state.root} updateInfo={this.updateInfo} updateRoot={this.updateRoot} highlightNode={this.highlightNode} nodes={this.state.nodes} updateNodes={this.updateNodes} canvas={this.canvasRef} consoleRef={this.consoleRef} speed={speed} isPlaying={isPlaying} />
                                    </div>
                                }
                                {featureTab === 'Traverse' &&
                                    <div className={css[`${"traverse"}`]}>
                                        <TraverseInBST root={this.state.root} highlightNode={this.highlightNode} updateInfo={this.updateInfo} consoleRef={this.consoleRef} speed={speed} isPlaying={isPlaying} />
                                    </div>
                                }
                                {featureTab === 'Search' &&
                                    <div className={css[`${"search"}`]}>
                                        <SearchInBST root={this.state.root} highlightNode={this.highlightNode} updateInfo={this.updateInfo} consoleRef={this.consoleRef} speed={speed} isPlaying={isPlaying} />
                                    </div>
                                }
                                {featureTab === 'Delete' &&
                                    <div className={css[`${"delete"}`]}>
                                        <DeleteNodeFromBST updateRoot={this.updateRoot} root={this.state.root} highlightNode={this.highlightNode} updateInfo={this.updateInfo} canvas={this.canvasRef} consoleRef={this.consoleRef} speed={speed} isPlaying={isPlaying} />
                                    </div>
                                }
                                {featureTab === 'GenerateTree' &&
                                    <div className={css[`${"generateTree"}`]}>
                                        <GenerateTrees updateRoot={this.updateRoot} updateNodes={this.updateNodes} consoleRef={this.consoleRef} />
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className={css[`${"text-container"}`]}>
                        <div className={css[`${"right-tab-container"}`]} onClick={this.handleRightTabClick}>
                            <div className={`${css['Console-tab']} ${css['tab']} ${css[`${activeTab === 'Console' ? 'active' : ''}`]}`}>
                                <button value={'Console'} >Console</button>
                            </div>
                            <div className={`${css['Code-tab']} ${css['tab']} ${css[`${activeTab === 'Code' ? 'active' : ''}`]}`}>
                                <button value={'Code'} >Code</button>
                            </div>
                        </div>

                        <div className={css["right-selected-tab-content"]}>
                            {
                                activeTab === 'Code' &&
                                <div className={`${css['code-container']} ${css['active']}`}>
                                    <code>BST code</code>
                                </div>
                            }
                            {
                                activeTab === 'Console' &&
                                <div className={css[`${"console"} ${css['active']}`]}>
                                    <div ref={this.consoleRef} className={css[`${"step-line"}`]}>
                                        <Text />
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div >
            </TreeContext.Provider >
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
