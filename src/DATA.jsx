export const BinarySearchTree = ({ speed, isPlaying }) => {
    const [nodes, setNodes] = useState([12, 23, 1, 23, 53, 68, 14, 10, 0, 13, 50]);
    const [root, setRoot] = useState(null);
    const [info, setInfo] = useState('hello');
    const [featureTab, setFeatureTab] = useState('Insert');
    const [activeTab, setActiveTab] = useState('Code');
    const [codeToDisplay, setCodeToDisplay] = useState(algorithmCodes.find(code => code.name === 'Insert').pseudocode);

    const canvasRef = useRef(null);
    const consoleRef = useRef(null);


    useEffect(() => {
        let r = null;

        const drawInitialTree = (root, key) => {
            if (!root) {
                return new BinaryTreeNode(key); // Create a new node if root is null
            }
            if (key < root.value) {
                root.left = drawInitialTree(root.left, key); // Check left subtree
            } else if (key > root.value) {
                root.right = drawInitialTree(root.right, key); // Check right subtree
            }
            return root;
        };
        nodes.forEach(node => {
            r = drawInitialTree(r, node);
        });
        setRoot(r);
    }, [nodes]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            root && drawBinaryTree(root, canvas, { type: VisualizationType.HIGHLIGHT });
        } else {
            console.error("Canvas is not loaded");
        }

        setTheme({
            radius: 17,
            fontSize: 13,
            textFont: "Arial",
            colorArray: [{ bgColor: 'white', borderColor: 'black' }],
            strokeColor: 'white',
        });
    }, [root]);

    const highlightNode = (root, flag, bgColor = '#FABC3F', borderColor = '#E85C0D', time = 1000) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (flag)
                    root.nodeCircle.colorSettings = { bgColor, borderColor }
                else {
                    root.nodeCircle.radiusSettings.currentRadius += 5
                    root.nodeCircle.colorSettings = { bgColor, borderColor }
                }
                let canvas = canvasRef.current
                if (canvas) {
                    drawBinaryTree(root, canvas, {
                        type: VisualizationType.HIGHLIGHT
                    });
                } else {
                    console.error("Canvas is not loaded")
                }
                resolve();
            }, time);
        });
    };

    const updateInfo = (value) => {
        setInfo(value);
        if (consoleRef.current) {
            const span = document.createElement('span');
            span.innerHTML = value;
            consoleRef.current.append(span);
        }
    };

    const handleTabClick = (e) => {
        if (e.target.tagName === 'BUTTON') {
            let code = algorithmCodes.find(code => code.name === e.target.value)
            if (code) {
                code = code.pseudocode;
                console.log(code)
            } else {
                code = ''
            }
            setCodeToDisplay(code);
            setFeatureTab(e.target.value);
        }
    };

    const handleRightTabClick = (e) => {
        if (e.target.tagName === 'BUTTON') {
            setActiveTab(e.target.value);
        }
    };

    const handleEditorDidMount = (editor) => {
        editor.updateOptions({ readOnly: true });
    };
    return (
        <TreeContext.Provider value={{ info }}>
            <div className={css['row']}>
                <div className={css['mid-content']}>
                    <div className={css['visualization-container']}>
                        <div className={css['svg-area']}>
                            <canvas ref={canvasRef}></canvas>
                        </div>
                    </div>
                    <div className={css['feature-container']}>
                        <div className={css['tab-container']} onClick={handleTabClick}>
                            <div className={`${css['Insert-tab']} ${css['tab']} ${css[featureTab === 'Insert' ? 'active' : '']}`}>
                                <button value={'Insert'}>Insert</button>
                            </div>
                            <div className={`${css['Search-tab']} ${css['tab']} ${css[featureTab === 'Search' ? 'active' : '']}`}>
                                <button value={'Search'}>Search</button>
                            </div>
                            <div className={`${css['Delete-tab']} ${css['tab']} ${css[featureTab === 'Delete' ? 'active' : '']}`}>
                                <button value={'Delete'}>Delete</button>
                            </div>
                            <div className={`${css['Traverse-tab']} ${css['tab']} ${css[featureTab === 'Traverse' ? 'active' : '']}`}>
                                <button value={'Traverse'}>Traverse</button>
                            </div>
                            <div className={`${css['GenerateTree-tab']} ${css['tab']} ${css[featureTab === 'GenerateTree' ? 'active' : '']}`}>
                                <button value={'GenerateTree'}>GenerateTree</button>
                            </div>
                        </div>
                        <div className={css['selected-tab-content']}>
                            {featureTab === 'Insert' && (
                                <div className={css.insert}>
                                    <InsertInBst root={root} updateNodes={setNodes} updateInfo={updateInfo} highlightNode={highlightNode} nodes={nodes} consoleRef={consoleRef} speed={speed} isPlaying={isPlaying} />
                                </div>
                            )}
                            {featureTab === 'Traverse' && (
                                <div className={css.traverse}>
                                    <TraverseInBST root={root} highlightNode={highlightNode} updateInfo={updateInfo} consoleRef={consoleRef} speed={speed} isPlaying={isPlaying} />
                                </div>
                            )}
                            {featureTab === 'Search' && (
                                <div className={css.search}>
                                    <SearchInBST root={root} highlightNode={highlightNode} updateInfo={updateInfo} consoleRef={consoleRef} speed={speed} isPlaying={isPlaying} />
                                </div>
                            )}
                            {featureTab === 'Delete' && (
                                <div className={css.delete}>
                                    <DeleteNodeFromBST root={root} highlightNode={highlightNode} updateInfo={updateInfo} consoleRef={consoleRef} speed={speed} isPlaying={isPlaying} />
                                </div>
                            )}
                            {featureTab === 'GenerateTree' && (
                                <div className={css.generateTree}>
                                    <GenerateTrees updateRoot={setRoot} updateNodes={setNodes} consoleRef={consoleRef} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className={css['text-container']}>
                    <div className={css['right-tab-container']} onClick={handleRightTabClick}>
                        <div className={`${css['Console-tab']} ${css['tab']} ${css[activeTab === 'Console' ? 'active' : '']}`}>
                            <button value={'Console'}>Console</button>
                        </div>
                        <div className={`${css['Code-tab']} ${css['tab']} ${css[activeTab === 'Code' ? 'active' : '']}`}>
                            <button value={'Code'}>Code</button>
                        </div>
                    </div>
                    <div className={css["right-selected-tab-content"]}>
                        {activeTab === 'Code' && (
                            <div className={`${css['code-container']} ${css['active']}`}>
                                <Editor
                                    className={css['editor']}
                                    language='javascript'
                                    onMount={handleEditorDidMount}
                                    value={codeToDisplay}
                                    options={{
                                        padding: {
                                            top: '10',
                                            left: '0'
                                        },
                                        minimap: { enabled: false },
                                        scrollBeyondLastLine: false,
                                        lineNumbersMinChars: 2,
                                        fontSize: 16,
                                        fontFamily: 'Fira Code, monospace',
                                        lineHeight: 19,
                                    }}
                                />
                            </div>
                        )}
                        {activeTab === 'Console' && (
                            <div className={`${css['console']} ${css['active']}`}>
                                <div ref={consoleRef} className={css['step-line']}>
                                    <Text />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </TreeContext.Provider>
    );
};
