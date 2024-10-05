import { BinaryTreePreview } from '../Component/CardPreview/index.jsx'

export const algorithmCard = [
    {
        name: 'Binary Tree',
        description: 'A Binary Tree Data Structure is a hierarchical data structure in which each node has at most two children, referred to as the left child and the right child. It is commonly used in computer science for efficient storage and retrieval of data, with various operations such as insertion, deletion, and traversal.',
        previewSvg: (classes) => {
            return (<BinaryTreePreview classes={classes} />)
        },
        path: 'BinaryTree',
        imagePath: '../Assets/images/arrayPreview.png'
    },
    {
        name: 'Array',
        description: 'Array is a linear data structure where all elements are arranged sequentially. It is a collection of elements of same data type stored at contiguous memory locations. ',
        previewSvg: (classes) => {
            return (<BinaryTreePreview classes={classes} />)
        },
        path: 'Array',
        imagePath: '../Assets/images/arrayPreview.png'
    },
    {
        name: 'Linked list',
        description: 'A linked list is a fundamental data structure in computer science. It mainly allows efficient insertion and deletion operations compared to arrays. Like arrays, it is also used to implement other data structures like stack, queue and deque.',
        previewSvg: (classes) => {
            return (<BinaryTreePreview classes={classes} />)
        },
        path: 'LinkedList',
        imagePath: '../Assets/images/arrayPreview.png'
    },
]

export const algorithmName = [
    {
        dataStructure: 'Binary Tree',
        algorithms: ['Binary Search Tree', 'Heap'],
        path: 'BinaryTree'
    },
    {
        dataStructure: 'Array',
        algorithms: ['Infix to Postfix', 'Postfix evalution', 'Well formedness', 'queue', 'stack', 'sort', 'Prefix evalution'],
        path: 'Array'
    },
    {
        dataStructure: 'Linked list',
        algorithms: ['Operation-in-Linkedlist'],
        path: 'LinkedList'
    },
]