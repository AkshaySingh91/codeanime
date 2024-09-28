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