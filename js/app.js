document.addEventListener('DOMContentLoaded', () => {
    const graph = new Graph();
    const visualizer = new GraphVisualizer('graph-network', graph);
    const dfsPathFinder = new DFSPathFinder(graph, visualizer);

    // UI Elements
    const nodeIdInput = document.getElementById('node-id');
    const addNodeBtn = document.getElementById('add-node-btn');
    const edgeFromInput = document.getElementById('edge-from');
    const edgeToInput = document.getElementById('edge-to');
    const edgeWeightInput = document.getElementById('edge-weight');
    const addEdgeBtn = document.getElementById('add-edge-btn');
    const graphTypeSelect = document.getElementById('graph-type');
    const resetGraphBtn = document.getElementById('reset-graph-btn');
    const loadSampleGraphBtn = document.getElementById('load-sample-graph-btn');

    const sourceNodeInput = document.getElementById('source-node');
    const destNodeInput = document.getElementById('dest-node');
    const findPathsBtn = document.getElementById('find-paths-btn');

    const animationSpeedSlider = document.getElementById('animation-speed');
    const speedValueSpan = document.getElementById('speed-value');
    const pauseResumeBtn = document.getElementById('pause-resume-btn');
    const stepForwardBtn = document.getElementById('step-forward-btn');

    const sortPathsSelect = document.getElementById('sort-paths');
    const pathsListUl = document.getElementById('paths-list');
    const statusMessageDiv = document.getElementById('status-message');

    let isGraphDirected = false;
    let isAlgorithmRunning = false;

    function updateGraphVisualization() {
        isGraphDirected = graphTypeSelect.value === 'directed';
        dfsPathFinder.isGraphDirected = isGraphDirected;
        visualizer.drawGraph(isGraphDirected);
        updateStatus("Graph updated.");
    }

    function updateStatus(message) {
        statusMessageDiv.textContent = `Status: ${message}`;
    }
    
    function setAlgorithmControls(enabled) {
        isAlgorithmRunning = enabled;
        pauseResumeBtn.disabled = !enabled;
        stepForwardBtn.disabled = !(enabled && visualizer.isPaused); // Only enable if paused
        findPathsBtn.disabled = enabled;
        addNodeBtn.disabled = enabled;
        addEdgeBtn.disabled = enabled;
        resetGraphBtn.disabled = enabled;
        loadSampleGraphBtn.disabled = enabled;
        graphTypeSelect.disabled = enabled;
    }

    // Event Listeners
    addNodeBtn.addEventListener('click', () => {
        const nodeId = nodeIdInput.value.trim();
        if (nodeId) {
            if (graph.addNode(nodeId)) {
                updateGraphVisualization();
                nodeIdInput.value = '';
            } else {
                alert("Node already exists!");
            }
        } else {
            alert("Please enter a node ID.");
        }
    });

    addEdgeBtn.addEventListener('click', () => {
        const from = edgeFromInput.value.trim();
        const to = edgeToInput.value.trim();
        const weight = parseInt(edgeWeightInput.value, 10) || 1;

        if (from && to) {
            if (!graph.getNode(from)) graph.addNode(from); // Auto-add nodes if they don't exist
            if (!graph.getNode(to)) graph.addNode(to);

            if (graph.addEdge(from, to, weight, isGraphDirected)) {
                updateGraphVisualization();
                edgeFromInput.value = '';
                edgeToInput.value = '';
                edgeWeightInput.value = '1';
            } else {
                alert("Failed to add edge. Ensure nodes exist.");
            }
        } else {
            alert("Please enter source and target node IDs for the edge.");
        }
    });

    graphTypeSelect.addEventListener('change', () => {
        // This is tricky if edges already exist. Best to reset or re-evaluate edges.
        // For simplicity, we just redraw. A more robust solution would rebuild edge directionality.
        updateGraphVisualization(); 
    });

    resetGraphBtn.addEventListener('click', () => {
        graph.reset();
        pathsListUl.innerHTML = '';
        updateGraphVisualization();
        updateStatus("Graph reset.");
    });
    
    loadSampleGraphBtn.addEventListener('click', () => {
        graph.reset();
        // Sample graph
        graph.addNode('A'); graph.addNode('B'); graph.addNode('C');
        graph.addNode('D'); graph.addNode('E'); graph.addNode('F');

        graph.addEdge('A', 'B', 2, isGraphDirected);
        graph.addEdge('A', 'C', 4, isGraphDirected);
        graph.addEdge('B', 'C', 1, isGraphDirected);
        graph.addEdge('B', 'D', 7, isGraphDirected);
        graph.addEdge('C', 'E', 3, isGraphDirected);
        graph.addEdge('D', 'F', 1, isGraphDirected);
        graph.addEdge('E', 'D', 2, isGraphDirected);
        graph.addEdge('E', 'F', 5, isGraphDirected);
        
        updateGraphVisualization();
        sourceNodeInput.value = 'A';
        destNodeInput.value = 'F';
        updateStatus("Sample graph loaded.");
    });


    findPathsBtn.addEventListener('click', async () => {
        const source = sourceNodeInput.value.trim();
        const dest = destNodeInput.value.trim();

        if (!source || !dest) {
            alert("Please select source and destination nodes.");
            return;
        }
        if (!graph.getNode(source) || !graph.getNode(dest)) {
            alert("Source or destination node does not exist in the graph.");
            return;
        }

        pathsListUl.innerHTML = '<li>Searching...</li>';
        updateStatus(`Finding paths from ${source} to ${dest}...`);
        setAlgorithmControls(true);
        visualizer.isPaused = false; // Ensure not starting paused
        pauseResumeBtn.textContent = 'Pause';


        const foundPaths = await dfsPathFinder.findAllPaths(source, dest);
        
        setAlgorithmControls(false);
        displayPaths(foundPaths);
        if (foundPaths.length === 0) {
            updateStatus(`No paths found from ${source} to ${dest}.`);
        } else {
            updateStatus(`Found ${foundPaths.length} path(s) from ${source} to ${dest}.`);
        }
    });

    animationSpeedSlider.addEventListener('input', (e) => {
        const speed = parseInt(e.target.value, 10);
        visualizer.setAnimationSpeed(speed);
        dfsPathFinder.visualizer.setAnimationSpeed(speed); // Ensure DFS also gets it
        speedValueSpan.textContent = `${speed}ms`;
    });
    // Initialize speed
    visualizer.setAnimationSpeed(parseInt(animationSpeedSlider.value, 10));
    dfsPathFinder.visualizer.setAnimationSpeed(parseInt(animationSpeedSlider.value, 10));


    pauseResumeBtn.addEventListener('click', () => {
        const isNowPaused = visualizer.togglePause();
        pauseResumeBtn.textContent = isNowPaused ? 'Resume' : 'Pause';
        stepForwardBtn.disabled = !(isAlgorithmRunning && isNowPaused);
        updateStatus(isNowPaused ? "Animation Paused." : "Animation Resumed.");
    });

    stepForwardBtn.addEventListener('click', () => {
        if (isAlgorithmRunning && visualizer.isPaused) {
            visualizer.forceStepForward();
             updateStatus("Stepped Forward.");
        }
    });
    
    sortPathsSelect.addEventListener('change', () => {
        // Re-display paths with new sort order
        // This assumes dfsPathFinder.allPaths still holds the last found paths
        displayPaths(dfsPathFinder.allPaths); 
    });

    function displayPaths(paths) {
        pathsListUl.innerHTML = '';
        if (!paths || paths.length === 0) {
            pathsListUl.innerHTML = '<li>No paths found.</li>';
            return;
        }

        let sortedPaths = [...paths]; // Create a copy to sort
        const sortBy = sortPathsSelect.value;

        if (sortBy === 'length') {
            sortedPaths.sort((a, b) => a.path.length - b.path.length || a.cost - b.cost);
        } else if (sortBy === 'cost') {
            sortedPaths.sort((a, b) => a.cost - b.cost || a.path.length - b.path.length);
        }
        // 'discovery' is the default order from DFS

        sortedPaths.forEach((p, index) => {
            const li = document.createElement('li');
            const pathString = p.path.join(' → ');
            li.textContent = `Path ${index + 1}: ${pathString} (Length: ${p.path.length}, Cost: ${p.cost})`;
            
            // Add click event to highlight this path on the graph
            li.addEventListener('click', () => {
                visualizer.resetHighlights();
                visualizer.highlightCompletePath(p.path, p.edges);
                updateStatus(`Highlighted path: ${pathString}`);
            });
            pathsListUl.appendChild(li);
        });
    }

    // Initial setup
    updateGraphVisualization();
    updateStatus("Ready. Create a graph or load a sample.");
    setAlgorithmControls(false); // Initially controls are disabled until algo runs
});