import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import css from './index.module.css';
import { algorithmName } from '../../Datastore/algoritmInfo';
import BinarySearchTree from '../BinarySearchTree/BinarySearchTree';
import HeapBinaryTree from '../HeapBinaryTree/HeapBinaryTree';
import InfixToPostfix from '../Array/infixToPostfix';
import PostfixEvaluation from '../Array/postfixEvalution';
import StackOperations from '../Array/stackOperations';
import WellFormedParentheses from '../Array/WellFormedParentheses';
import PrefixEvaluation from '../Array/prefixEvaluation';
import QueueOperations from '../Array/queueOperations';

const AlgorithmVisualization = (props) => {
    const { algoName } = useParams();
    const [selectedAlgorithm, setSelectedAlgorithm] = useState(algoName);
    const [speed, setSpeed] = useState(1);
    const [isPlaying, setIsPlaying] = useState('play');
    const [toggleCollapse, setToggleCollapse] = useState({});

    useEffect(() => {
        setSelectedAlgorithm(algoName);
    }, [algoName]);

    const handleSpeedChange = (e) => {
        setSpeed(Number.parseFloat(e.target.value));
    };

    const handleToggleCollapse = (category) => {
        setToggleCollapse((prevToggleCollapse) => ({
            ...prevToggleCollapse,
            [category]: !prevToggleCollapse[category],
        }));
    };

    // Use useEffect to handle the window.open call based on the selected algorithm
    useEffect(() => {
        if (selectedAlgorithm === 'sort') {
            window.open('http://127.0.0.1:5500/Web%20Development/codeanime/src/Component/Array/sort/index.html', '_blank');
        } else if (selectedAlgorithm === 'Operation-in-Linkedlist') {
            window.open('http://127.0.0.1:5500/Web%20Development/codeanime/src/Component/LinkedList/Linked-List-Visualization-master/index.html', '_blank');
        }
    }, [selectedAlgorithm]);

    const showSelectedAlgorithm = () => {
        if (selectedAlgorithm === 'Binary-Search-Tree') {
            return <BinarySearchTree speed={speed} isPlaying={isPlaying} />;
        } else if (selectedAlgorithm === 'Heap') {
            return <HeapBinaryTree speed={speed} isPlaying={isPlaying} />;
        } else if (selectedAlgorithm === 'Infix-to-Postfix') {
            return <InfixToPostfix speed={speed} isPlaying={isPlaying} />;
        } else if (selectedAlgorithm === 'Postfix-evalution') {
            return <PostfixEvaluation speed={speed} isPlaying={isPlaying} />;
        } else if (selectedAlgorithm === 'stack') {
            return <StackOperations speed={speed} isPlaying={isPlaying} />;
        } else if (selectedAlgorithm === 'Well-formedness') {
            return <WellFormedParentheses speed={speed} isPlaying={isPlaying} />;
        } else if (selectedAlgorithm === 'Prefix-evalution') {
            return <PrefixEvaluation speed={speed} isPlaying={isPlaying} />;
        } else if (selectedAlgorithm === 'queue') {
            return <QueueOperations speed={speed} isPlaying={isPlaying} />;
        }

        return null;
    };

    const handlePlayBtn = () => {
        setIsPlaying((prevIsPlaying) => (prevIsPlaying === 'play' ? 'pause' : 'play'));
    };

    return (
        <div className={css[`${"algorithm-visualization-page"}`]}>
            <div className={css[`${"sidebar"}`]}>
                <div className={css[`${"data-structure-list"}`]}>
                    {algorithmName.map(({ dataStructure, algorithms, path }, idx) => (
                        <div key={idx} className={css[`${"algorithm-category"}`]}>
                            <button
                                type="button"
                                className={css['collapsible']}
                                onClick={() => handleToggleCollapse(dataStructure)}
                            >
                                {dataStructure}
                                <i className={css[`${"arrow"}`] + css["right"]}></i>
                            </button>
                            {toggleCollapse[dataStructure] && (
                                <div className={css[`${"content"}`]}>
                                    <ul className={css[`${"algorithm-list"}`]}>
                                        {algorithms.map((algo, index) => {
                                            let algoPath = algo.replaceAll(' ', '-');
                                            return (
                                                <li key={index}>
                                                    <Link to={`/${path}/${algoPath}/algorithm`}>{algo}</Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <main className={css[`${"main-content"}`]}>
                <div className={css[`${"controller-bar"}`]}>
                    <div className={css[`${"player"}`]}>
                        <button className={css[`${isPlaying}`]} onClick={handlePlayBtn}></button>
                        <span>{isPlaying}</span>
                    </div>

                    <div className={css[`${"speedController"}`]}>
                        <label htmlFor="speed">Speed:</label>
                        <input
                            type="range"
                            id="speed"
                            min="0.5"
                            max="3"
                            step="0.1"
                            value={speed}
                            onChange={handleSpeedChange}
                        />
                        <span>{speed}x</span>
                    </div>
                </div>
                {showSelectedAlgorithm()}
            </main>
        </div>
    );
};



export default AlgorithmVisualization;
