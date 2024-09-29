import { BinaryTreePreview } from '../Component/CardPreview/index.jsx'

export const algorithmCard = [
    {
        name: 'Binary Tree',
        description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas, provident. Amet excepturi et beatae illum tempora maxime, tenetur adipisci possimus minima ad quia a aliquid, animi sunt quae cupiditate iusto?',
        previewSvg: (classes) => {
            return (<BinaryTreePreview classes={classes} />)
        },
        path: 'BinaryTree'
    },
    {
        name: 'Heap',
        description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas, provident. Amet excepturi et beatae illum tempora maxime, tenetur adipisci possimus minima ad quia a aliquid, animi sunt quae cupiditate iusto?',
        previewSvg: (classes) => {
            return (<BinaryTreePreview classes={classes} />)
        },
        path: 'HeapBinaryTree'
    },
    {
        name: 'Linked list',
        description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas, provident. Amet excepturi et beatae illum tempora maxime, tenetur adipisci possimus minima ad quia a aliquid, animi sunt quae cupiditate iusto?',
        previewSvg: (classes) => {
            return (<BinaryTreePreview classes={classes} />)
        },
        path: 'LinkedList'
    },
]

export const algorithmName = [
    {
        dataStructure: 'Backtracking',
        algorithms: ['Hamiltonian Cycles', 'Knight\'s Tour Problem', 'N-Queens Problem', 'Sum of Subsets']
    },
    {
        dataStructure: 'Branch and Bound',
        algorithms: ['Binary Search', 'Binary Search Tree', 'Depth-Limited Search', 'Topological Sort']
    },
    {
        dataStructure: 'Brute Force',
        algorithms: ['Subset Sum']
    },
    {
        dataStructure: 'Divide and Conquer',
        algorithms: ['Merge Sort', 'Quick Sort']
    }
]