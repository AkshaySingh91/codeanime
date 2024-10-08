import React, { Component } from 'react';
import { BinaryTreeNode, drawBinaryTree, VisualizationType, setTheme } from 'binary-tree-visualizer';
import css from './BinarySearchTree.module.css'
// default {bgColor: 'white', borderColor: 'black'}
setTheme({
    radius: 17,
    fontSize: 13,
    textFont: "Arial",
    colorArray: [{ bgColor: 'white', borderColor: 'black' }],
    strokeColor: 'grey',

})

export const algorithmCodes = [
    {
        name: 'Insert',
        pseudocode: `function insert(root, key):\n    if root is NULL:\n        return createNode(key)\n    if key < root.key:\n        root.left = insert(root.left, key)\n    else if key > root.key:\n        root.right = insert(root.right, key)\n    // If key is equal to root.key, do not insert duplicates\n    return root`
    },
    {
        name: 'Search',
        pseudocode: `function search(root, key):\n    if root is NULL:\n        return NULL\n    if key < root.key:\n        return search(root.left, key)\n    else if key > root.key:\n        return search(root.right, key)\n    return root`
    },
    {
        name: 'Delete',
        pseudocode: `function deleteNode(root, key):\n    if root is NULL:\n        return root\n    if key < root.key:\n        root.left = deleteNode(root.left, key)\n    else if key > root.key:\n        root.right = deleteNode(root.right, key)\n    else:\n        // Node with only one child or no child\n        if root.left is NULL:\n            return root.right\n        else if root.right is NULL:\n            return root.left\n        // Node with two children: Get the inorder successor (smallest in the right subtree)\n        temp = minValueNode(root.right)\n        root.key = temp.key\n        root.right = deleteNode(root.right, temp.key)\n    return root`
    },
    {
        name: 'Inorder Traversal',
        pseudocode: `function inorderTraversal(root):\n    if root is NULL:\n        return\n    inorderTraversal(root.left)\n    visit(root)\n    inorderTraversal(root.right)`
    },
    {
        name: 'Preorder Traversal',
        pseudocode: `function preorderTraversal(root):\n    if root is NULL:\n        return\n    visit(root)\n    preorderTraversal(root.left)\n    preorderTraversal(root.right)`
    },
    {
        name: 'Postorder Traversal',
        pseudocode: `function postorderTraversal(root):\n    if root is NULL:\n        return\n    postorderTraversal(root.left)\n    postorderTraversal(root.right)\n    visit(root)`
    },
    {
        name: 'Create',
        pseudocode: `function insert(root, key):\n    if root is NULL:\n        return createNode(key)\n    if key < root.key:\n        root.left = insert(root.left, key)\n    else if key > root.key:\n        root.right = insert(root.right, key)\n    // If key is equal to root.key, do not insert duplicates\n    return root`
    },

];


class SearchInBST extends Component {
    constructor() {
        super()
        this.state = {
            searchValue: 1
        }
        this.isPlayingRef = React.createRef();
    }
    checkIsPlaying = async () => {
        while (this.isPlayingRef.current === 'pause') {
            await new Promise(resolve => setTimeout(resolve, 100)); // Poll every 100ms
        }
    };
    componentDidUpdate(prevProps) {
        if (prevProps.isPlaying !== this.props.isPlaying) {
            this.isPlayingRef.current = this.props.isPlaying;
        }
    }
    searchingInBST = async (e) => {
        e.preventDefault()
        const { searchValue } = this.state
        const { root, highlightNode, updateInfo, consoleRef, speed, isPlaying } = this.props
        if (consoleRef.current) {
            consoleRef.current.innerHTML = '';
        }
        let delay = 1000 / (speed);
        updateInfo(`Root is ${root.value}`)
        const startSearching = async (root, searchValue) => {
            await this.checkIsPlaying(isPlaying);

            if (!root) {
                return;
            }
            if (searchValue === root.value) {
                await highlightNode(root, false, '#FABC3F', 'black', delay)
                updateInfo(`${searchValue} has found.`)
                await highlightNode(root, true, 'white', 'black', delay)
                return true;
            }
            else if (root.value > searchValue) {
                await highlightNode(root, false, 'white', '#821131', delay)
                updateInfo(`${root.value} is Greater than ${searchValue}, so searching on Left.`)
                await highlightNode(root, true, 'white', 'black', delay)
                return await startSearching(root.left, searchValue)
            }
            else {
                await highlightNode(root, false, 'white', '#821131', delay)
                updateInfo(`${root.value} is Smaller than ${searchValue}, so searching on Right.`)
                await highlightNode(root, true, 'white', 'black', delay)
                return await startSearching(root.right, searchValue)
            }
        }
        if (await startSearching(root, searchValue) !== true) {
            updateInfo(`${searchValue} is not present.`)
        }
    }
    render() {
        return (<>
            <div className={css["searchInBST"]}>
                <form className={css["my-2"]} onSubmit={this.searchingInBST}>
                    <label htmlFor="searchInBST">Search In BSt</label>
                    <div className="input-group w-25" >
                        <input name='searchValue' type="number" className="form-control w-25" id="searchInBST" aria-describedby="emailHelp" placeholder="Enter Vertex"
                            onChange={(e) => {
                                this.setState({ searchValue: Number.parseInt(e.target.value) })
                            }} />
                        <button type="submit" className="btn btn-primary">Go</button>
                    </div>
                </form>
            </div>
        </>)
    }

}

class DeleteNodeFromBST extends Component {
    constructor() {
        super()
        this.state = {
            deleteValue: 1
        }
        this.isPlayingRef = React.createRef();
    }
    checkIsPlaying = async () => {
        while (this.isPlayingRef.current === 'pause') {
            await new Promise(resolve => setTimeout(resolve, 100)); // Poll every 100ms
        }
    };
    componentDidUpdate(prevProps) {
        if (prevProps.isPlaying !== this.props.isPlaying) {
            this.isPlayingRef.current = this.props.isPlaying;
        }
    }
    DeleteNode = async (node) => {
        if (!node.right) {
            return node.left
        }
        else if (!node.left) {
            return node.right
        }
        else {
            // node has left as well as right child
            // seprate right child
            const rightSubTree = node.right
            const leftSubTree = node.left
            let trav = rightSubTree
            while (trav && trav.left) {
                trav = trav.left
            }
            trav.left = leftSubTree
            return rightSubTree;
        }
    }

    DeleteingInBST = async (e) => {
        e.preventDefault()
        const { deleteValue } = this.state
        const { root, highlightNode, updateInfo, updateRoot, consoleRef, speed } = this.props
        if (consoleRef.current) {
            consoleRef.current.innerHTML = '';
        }
        updateInfo(`Root is ${root.value}`)
        let delay = 1000 / (speed);
        const startDeleting = async (root, deleteValue) => {
            await this.checkIsPlaying()
            if (!root) {
                return;
            }
            if (deleteValue === root.value) {
                await highlightNode(root, false, '#FABC3F', 'black', delay)
                await highlightNode(root, true, 'white', 'black', delay)
                updateInfo(`${deleteValue} has found.`)
                return await this.DeleteNode(root)
            }
            else if (root.value > deleteValue) {
                await highlightNode(root, false, 'white', '#821131', delay)
                await highlightNode(root, true, 'white', 'black', delay)
                updateInfo(`${root.value} is Greater than ${deleteValue}, so searching on Left.`)
                root.left = await startDeleting(root.left, deleteValue)
            }
            else {
                await highlightNode(root, false, 'white', '#821131', delay)
                await highlightNode(root, true, 'white', 'black', delay)
                updateInfo(`${root.value} is Smaller than ${deleteValue}, so searching on Right.`)
                root.right = await startDeleting(root.right, deleteValue)
            }
            return root
        }

        const resultTree = await startDeleting(root, deleteValue)
        if (!resultTree) {
            updateInfo(`${deleteValue} is not present.`)
        } else {
            updateRoot(resultTree)
        }
    }
    render() {
        return (<>
            <div className={css["deleteInBST"]}>
                <form className={css["my-3"]} onSubmit={this.DeleteingInBST}>
                    <label htmlFor="deleteInBST">Delete In BSt</label>
                    <div className="input-group w-25" >
                        <input name='deleteValue' type="number" className="form-control w-25" id="deleteInBST" placeholder="Enter Vertex"
                            onChange={(e) => {
                                this.setState({ deleteValue: Number.parseInt(e.target.value) })
                            }} />
                        <button type="submit" className="btn btn-primary">Go</button>
                    </div>
                </form>
            </div>
        </>)
    }

}


class InsertInBst extends Component {
    constructor() {
        super()
        this.state = {
            userInput: '34, 23, 15, 1, 5, 20',
        }
        this.isPlayingRef = React.createRef();
    }

    insertInBst = async (e) => {
        e.preventDefault()
        let { nodes, root, updateNodes, updateRoot, canvas, consoleRef } = this.props
        if (consoleRef.current) {
            consoleRef.current.innerHTML = '';
        }
        const { userInput } = this.state
        let n = Number.parseInt(userInput)
        let updatedNodes = [...nodes, !nodes.includes(n) ? n : []];
        let r = await this.insertNodeInBst(root, n)
        if (canvas.current) {
            drawBinaryTree(r, canvas.current, {
                type: VisualizationType.HIGHLIGHT
            });
        } else {
            console.error("Canvas is not loaded")
        }
        updateRoot(r)
        updateNodes(updatedNodes)
    }
    checkIsPlaying = async () => {
        while (this.isPlayingRef.current === 'pause') {
            await new Promise(resolve => setTimeout(resolve, 100)); // Poll every 100ms
        }
    };
    componentDidUpdate(prevProps) {
        if (prevProps.isPlaying !== this.props.isPlaying) {
            this.isPlayingRef.current = this.props.isPlaying;
        }
    }
    insertNodeInBst = async (root, key) => {
        const { updateInfo, highlightNode, speed = 1000 } = this.props
        let delay = 1000 / (speed);
        await this.checkIsPlaying();
        if (!root) {
            return new BinaryTreeNode(key);
        }
        if (root && root.value === key) {
            updateInfo(`${key} is already present.`)
            return root;
        }
        if (root && key < root.value) {
            if (root && !root.left) {
                // default {bgColor: 'white', borderColor: 'black'}
                await highlightNode(root, true, '#FABC3F', 'red', delay)
                await highlightNode(root, true, 'white', 'black', delay)
                updateInfo(`${key} will insert on left of ${root.value}.`)
            } else {
                await highlightNode(root, false, 'white', 'red', delay);
                await highlightNode(root, true, 'white', 'black', delay);
                updateInfo(`vertex ${root.value} is greater than ${key}, going on left side`)
            }
            const left = await this.insertNodeInBst(root.left, key)
            root.setLeft(left);
        }
        else if (root && key > root.value) {
            if (root && !root.right) {
                await highlightNode(root, true, '#FABC3F', 'red', delay)
                await highlightNode(root, true, 'white', 'black', delay)
                updateInfo(`${key} will insert on right of ${root.value}.`)
            } else {
                await highlightNode(root, false, 'white', 'red', delay);
                await highlightNode(root, true, 'white', 'black', delay);
                updateInfo(`vertex ${root.value} is smaller than ${key}, going on right side`)
            }
            const right = await this.insertNodeInBst(root.right, key)
            root.setRight(right);
        }
        return root;
    }

    render() {
        return (<>
            <div className={css["insertInBST"]}>
                <form onSubmit={this.insertInBst} action="">
                    <label htmlFor="insertInBST">Insert In BSt</label>
                    <div className="input-group mb-3 w-25">
                        <input id='insertInBST' value={this.state.userInput} name='userInput' type="number" className={css["form-control"]} placeholder="Insert in BST"
                            onChange={(e) => {
                                this.setState({ userInput: e.target.value })
                            }} />
                        <button className="btn btn-outline-secondary" type="submit">Insert</button>
                    </div>
                </form>
            </div>
        </>)
    }
}
class CreateBST extends Component {
    constructor() {
        super()
        this.state = {
            userInput: '34, 0, -2, 4, 234, 32',
        }
        this.isPlayingRef = React.createRef();
    }

    createBST = async (e) => {
        e.preventDefault()
        let { nodes, updateNodes, updateRoot, canvas, consoleRef } = this.props
        if (consoleRef.current) {
            consoleRef.current.innerHTML = '';
        }
        const { userInput } = this.state
        let array = userInput.split(',').map((elem) => { return Number.parseInt(elem.trim()) })
        array = array.filter((item, index) => array.indexOf(item) === index);
        let updatedNodes = [...nodes, ...array];
        let r = null;
        for (const i of array) {
            r = await this.insertNodeInBst(r, i)
            if (canvas.current) {
                drawBinaryTree(r, canvas.current, {
                    type: VisualizationType.HIGHLIGHT
                });
            } else {
                console.error("Canvas is not loaded")
            }
            updateRoot(r)
        }
        updateNodes(updatedNodes)
    }
    checkIsPlaying = async () => {
        while (this.isPlayingRef.current === 'pause') {
            await new Promise(resolve => setTimeout(resolve, 100)); // Poll every 100ms
        }
    };
    componentDidUpdate(prevProps) {
        if (prevProps.isPlaying !== this.props.isPlaying) {
            this.isPlayingRef.current = this.props.isPlaying;
        }
    }
    insertNodeInBst = async (root, key) => {
        const { updateInfo, highlightNode, speed = 1000 } = this.props
        let delay = 1000 / (speed);

        await this.checkIsPlaying();
        if (!root) {
            return new BinaryTreeNode(key);
        }
        if (root && root.value === key) {
            return root;
        }
        if (root && key < root.value) {
            if (root && !root.left) {
                // default {bgColor: 'white', borderColor: 'black'}
                await highlightNode(root, true, '#FABC3F', 'red', delay)
                await highlightNode(root, true, 'white', 'black', delay)
                updateInfo(`${key} will insert on left of ${root.value}.`)
            } else {
                await highlightNode(root, false, 'white', 'red', delay);
                await highlightNode(root, true, 'white', 'black', delay);
                updateInfo(`vertex ${root.value} is greater than ${key}, going on left side`)
            }
            const left = await this.insertNodeInBst(root.left, key)
            root.setLeft(left);
        }
        else if (root && key > root.value) {
            if (root && !root.right) {
                await highlightNode(root, true, '#FABC3F', 'red', delay)
                await highlightNode(root, true, 'white', 'black', delay)
                updateInfo(`${key} will insert on right of ${root.value}.`)
            } else {
                await highlightNode(root, false, 'white', 'red', delay);
                await highlightNode(root, true, 'white', 'black', delay);
                updateInfo(`vertex ${root.value} is smaller than ${key}, going on right side`)
            }
            const right = await this.insertNodeInBst(root.right, key)
            root.setRight(right);
        }
        return root;
    }

    render() {
        return (<>
            <div className={css["insertInBST"]}>
                <form onSubmit={this.createBST} action="">
                    <label htmlFor="insertInBST">Create Binary search tree</label>
                    <div className="input-group mb-3 w-25">
                        <input id='insertInBST' value={this.state.userInput} name='userInput' type="text" className={css["form-control"]} placeholder="Insert in BST"
                            onChange={(e) => {
                                this.setState({ userInput: e.target.value })
                            }} />
                        <button className="btn btn-outline-secondary" type="submit">Insert</button>
                    </div>
                </form>
            </div>
        </>)
    }
}


class TraverseInBST extends Component {
    constructor() {
        super();
        this.isPlayingRef = React.createRef();
    }
    checkIsPlaying = async () => {
        while (this.isPlayingRef.current === 'pause') {
            await new Promise(resolve => setTimeout(resolve, 100)); // Poll every 100ms
        }
    };
    componentDidUpdate(prevProps) {
        if (prevProps.isPlaying !== this.props.isPlaying) {
            this.isPlayingRef.current = this.props.isPlaying;
        }
    }
    postorderTraversal = async (root) => {
        const { updateInfo, highlightNode, consoleRef, speed } = this.props
        if (consoleRef.current) {
            consoleRef.current.innerHTML = '';
        }

        updateInfo(`root is ${root.value}`)
        let sequence = 'Preorder Sequence:  ';
        let delay = 1000 / (speed);
        const startPostorderTraversal = async (node) => {
            await this.checkIsPlaying();
            if (!node) {
                return
            }
            await highlightNode(node, false, 'white', 'red', delay * 2)
            await highlightNode(node, true, 'white', 'black', delay)
            let msg = node.left ? `Left node of vertex ${node.value} is ${node.left.value}, So Recursive to Left child.` : `Left node of vertex ${node.value} is empty, So return Empty.`
            updateInfo(msg)
            await startPostorderTraversal(node.left)

            msg = node.right ? `Right node of vertex ${node.value} is ${node.right.value}, So Recursive to Right child.` : `Right node of vertex ${node.value} is empty, So return Empty.`
            updateInfo(msg)
            await startPostorderTraversal(node.right)

            sequence += ` ${node.value} `
            msg = `visited vertex ${node.value} ${sequence}`
            updateInfo(msg)
            console.log(node.value)
            await highlightNode(node, true, '#FABC3F', 'red', delay)
            await highlightNode(node, true, 'white', 'black', delay * 2)
        }
        await startPostorderTraversal(root)
    }
    preorderTraversal = async (root) => {
        const { updateInfo, highlightNode, consoleRef, speed } = this.props
        if (consoleRef.current) {
            consoleRef.current.innerHTML = '';
        }
        updateInfo(`root is ${root.value}`)
        let sequence = 'Preorder Sequence:';
        let delay = 1000 / (speed);
        const startPreorderTraversal = async (node) => {
            await this.checkIsPlaying();
            if (!node) {
                return
            }
            await highlightNode(node, false, 'white', 'red', delay * 2)
            await highlightNode(node, true, '#FABC3F', 'black', delay)
            sequence += ` ${node.value} `
            let msg = `visited vertex ${node.value} ${sequence}`
            updateInfo(msg)
            console.log(node.value)

            await highlightNode(node, true, 'white', 'black', delay)
            msg = node.left ? `Left node of vertex ${node.value} is ${node.left.value}, So Recursive to Left child.` : `Left node of vertex ${node.value} is empty, So return Empty.`
            updateInfo(msg)
            await startPreorderTraversal(node.left)

            msg = node.right ? `Right node of vertex ${node.value} is ${node.right.value}, So Recursive to Right child.` : `Right node of vertex ${node.value} is empty, So return Empty.`
            updateInfo(msg)
            await startPreorderTraversal(node.right)
        }
        await startPreorderTraversal(root)
    }
    inorderTraversal = async (root) => {
        const { updateInfo, highlightNode, consoleRef, speed } = this.props
        if (consoleRef.current) {
            consoleRef.current.innerHTML = '';
        }
        updateInfo(`root is ${root.value}`)
        let sequence = 'Inorder Sequence:';
        let delay = 1000 / (speed);
        const startInorderTraversal = async (node) => {
            await this.checkIsPlaying();
            if (!node) {
                return
            }
            // left
            await highlightNode(node, false, 'white', 'red', delay * 2)
            await highlightNode(node, true, 'white', 'black', delay)
            let msg = node.left ? `Left node of vertex ${node.value} is ${node.left.value}, So Recursive to Left child.` : `Left node of vertex ${node.value} is empty, So return Empty.`
            updateInfo(msg)
            await startInorderTraversal(node.left)
            // root
            sequence += ` ${node.value} `
            msg = `visited vertex ${node.value} ${sequence}`
            updateInfo(msg)
            // right
            await highlightNode(node, true, '#FABC3F', 'red', delay * 2)
            await highlightNode(node, true, 'white', 'black', delay)
            msg = node.right ? `Right node of vertex ${node.value} is ${node.right.value}, So Recursive to Right child.` : `Right node of vertex ${node.value} is empty, So return Empty.`
            updateInfo(msg)
            await startInorderTraversal(node.right)
        }
        await startInorderTraversal(root)
    }

    render() {
        const { root } = this.props
        return (<>
            <div className={css["input-group"]}>
                <select defaultValue={'Choose Traveral Type'} className={css["custom-select"]}
                    onChange={async (e) => {
                        const trav = e.target.value
                        if (trav === 'Inorder') {
                            await this.inorderTraversal(root);
                        }
                        else if (trav === 'Preorder') {
                            await this.preorderTraversal(root);
                        }
                        else if (trav === 'Postorder') {
                            await this.postorderTraversal(root);
                        }
                    }}>
                    <option value={'Choose Traveral Type'} disabled={true}>Choose Traveral Type</option>
                    <option value={'Inorder'} >Inorder</option>
                    <option value={'Preorder'} >Preorder</option>
                    <option value={'Postorder'} >Postorder</option>
                </select>
            </div >
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
            <div className={css[`${"input-group"}`]}>
                <select defaultValue={this.state.treeType} className={css[`${"custom-select"}`]} id="inputGroupSelect04"
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

export { SearchInBST, DeleteNodeFromBST, InsertInBst, TraverseInBST, GenerateTrees, CreateBST }
