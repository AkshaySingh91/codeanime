import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './index.css';
import { algorithmName } from '../../Datastore/algoritmInfo';
import BinarySearchTree from '../BinarySearchTree/BinarySearchTree';
import HeapBinaryTree from '../HeapBinaryTree/HeapBinaryTree';
import InfixToPostfix from '../Array/infixToPostfix';
import PostfixEvaluation from '../Array/postfixEvalution';
import StackOperations from '../Array/stackOperations';
import WellFormedParentheses from '../Array/WellFormedParentheses';
import QueueOperations from '../Array/queueOperations';
 
const AlgorithmVisualization = (props) => {
    const { dataStructure, algoName } = useParams();
    const navigate = useNavigate();
    const [selectedAlgorithm, setSelectedAlgorithm] = useState(algoName || '');
    const [speed, setSpeed] = useState(1);
    const [isPlaying, setIsPlaying] = useState('play');
    const [toggleCollapse, setToggleCollapse] = useState({});

    useEffect(() => {
        if (props.defaultAlgorithm) {
            let firstAlgorithm = algorithmName.find(algo => algo.path === dataStructure)?.algorithms[0];
            if (firstAlgorithm) {
                const algoPath = firstAlgorithm.replaceAll(' ', '-');
                navigate(`/${dataStructure}/${algoPath}/algorithm`);
            }
        } else {
            setSelectedAlgorithm(algoName);
        }
    }, [dataStructure, algoName, navigate]);

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
        if (selectedAlgorithm === 'queue') {
            window.open('http://127.0.0.1:5500/Web%20Development/codeanime/src/Component/Array/queue/index.html', '_blank');
        } else if (selectedAlgorithm === 'sort') {
            window.open('http://127.0.0.1:5500/Web%20Development/codeanime/src/Component/Array/sort/index.html', '_blank');
        } else if (selectedAlgorithm === 'Prefix-evalution') {
            window.open('http://127.0.0.1:5500/Web%20Development/codeanime/src/Component/Array/prefixEvaluation/index.html', '_blank');
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
        }

        return null;
    };

    const handlePlayBtn = () => {
        setIsPlaying((prevIsPlaying) => (prevIsPlaying === 'play' ? 'pause' : 'play'));
    };

    return (
        <div className="algorithm-visualization-page">
            <div className="sidebar">
                <div className="data-structure-list">
                    {algorithmName.map(({ dataStructure, algorithms, path }, idx) => (
                        <div key={idx} className="algorithm-category">
                            <button
                                type="button"
                                className={`${''} collapsible`}
                                onClick={() => handleToggleCollapse(dataStructure)}
                            >
                                {dataStructure}
                                <i className="arrow right"></i>
                            </button>
                            {toggleCollapse[dataStructure] && (
                                <div className="content">
                                    <ul className="algorithm-list">
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
            <main className="main-content">
                <div className="controller-bar">
                    <div className="player">
                        <button className={isPlaying} onClick={handlePlayBtn}></button>
                        <span>{isPlaying}</span>
                    </div>

                    <div className="speedController">
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
