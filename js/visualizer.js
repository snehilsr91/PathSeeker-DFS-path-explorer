class GraphVisualizer {
    constructor(containerId, graphInstance) {
        this.container = document.getElementById(containerId);
        this.graphInstance = graphInstance; // Reference to the Graph class instance
        this.visNodes = new vis.DataSet();
        this.visEdges = new vis.DataSet();
        this.animationSpeed = 500; // ms
        this.isPaused = false;
        this.stepPromise = null;
        this.stepResolve = null;

        const options = {
            layout: {
                hierarchical: false // Can be configured further
            },
            edges: {
                arrows: {
                    to: { enabled: false } // Default, will be overridden by graph type
                },
                smooth: {
                    enabled: true,
                    type: "dynamic"
                },
                font: { align: 'middle' },
                color: {
                    color: '#848484',
                    highlight: '#848484',
                    hover: '#848484',
                }
            },
            nodes: {
                shape: 'ellipse',
                color: {
                    border: '#2B7CE9',
                    background: '#97C2FC',
                    highlight: {
                        border: '#2B7CE9',
                        background: '#D2E5FF'
                    }
                }
            },
            interaction: {
                dragNodes: true,
                dragView: true,
                zoomView: true
            },
            physics: { // Enable physics for better layout
                enabled: true,
                barnesHut: {
                    gravitationalConstant: -2000,
                    centralGravity: 0.1,
                    springLength: 150,
                    springConstant: 0.02,
                    damping: 0.09,
                    avoidOverlap: 0.1
                },
                solver: 'barnesHut', // or 'forceAtlas2Based', 'repulsion'
                stabilization: {iterations: 1000}
            }
        };
        this.network = new vis.Network(this.container, { nodes: this.visNodes, edges: this.visEdges }, options);
    }

    setAnimationSpeed(speed) {
        this.animationSpeed = speed;
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        if (!this.isPaused && this.stepResolve) {
            this.stepResolve(); // Resolve pending step if resuming
            this.stepPromise = null;
            this.stepResolve = null;
        }
        return this.isPaused;
    }

    async step() {
        if (this.isPaused) {
            if (this.stepResolve) this.stepResolve(); // Resolve current step
            this.stepPromise = new Promise(resolve => { this.stepResolve = resolve; });
            await this.stepPromise;
        } else {
            await sleep(this.animationSpeed);
        }
    }

    forceStepForward() {
        if (this.isPaused && this.stepResolve) {
            this.stepResolve();
            // Re-establish promise for next pause
            this.stepPromise = new Promise(resolve => { this.stepResolve = resolve; });
        }
    }


    drawGraph(isDirected) {
        const nodesData = this.graphInstance.getAllNodes().map(node => ({
            id: node.id,
            label: String(node.label)
        }));
        const edgesData = this.graphInstance.getAllEdges(isDirected).map(edge => ({
            id: edge.id,
            from: edge.from,
            to: edge.to,
            label: String(edge.weight),
            arrows: isDirected ? 'to' : undefined,
            value: edge.weight // for potential scaling if needed
        }));

        this.visNodes.clear();
        this.visEdges.clear();
        this.visNodes.add(nodesData);
        this.visEdges.add(edgesData);
        this.network.setOptions({ edges: { arrows: { to: { enabled: isDirected } } } });
        this.network.fit(); // Fit graph to view
    }

    highlightNode(nodeId, type = 'visiting') { 
        let color;
        switch(type) {
            case 'visiting': color = { border: '#FFA500', background: '#FFD700' }; break;
            case 'backtrack': color = { border: '#DC143C', background: '#FFB6C1' }; break;
            case 'current': color = { border: '#32CD32', background: '#90EE90' }; break;
            case 'path_node': color = { border: '#1E90FF', background: '#ADD8E6' }; break;
            default: color = { border: '#2B7CE9', background: '#97C2FC' };
        }
        this.visNodes.update({ id: nodeId, color: color });
    }

    highlightEdge(edgeId, type = 'traversing') { // types: traversing, path_edge
        let color, width;
        switch(type) {
            case 'traversing': color = '#FFA500'; width = 3; break; // Orange
            case 'path_edge': color = '#1E90FF'; width = 4; break; // DodgerBlue
            default: color = '#848484'; width = 1; // Default
        }
        try {
            this.visEdges.update({ id: edgeId, color: { color: color, highlight: color }, width: width });
        } catch (e) {
            // This can happen if edgeId is from an undirected representation (e.g. B-A vs A-B)
            // and vis.js only has one representation. Try to find the edge by from/to.
            const edge = this.visEdges.get().find(e => 
                (e.from === edgeId.split('_')[1] && e.to === edgeId.split('_')[2]) ||
                (e.to === edgeId.split('_')[1] && e.from === edgeId.split('_')[2])
            );
            if (edge) {
                 this.visEdges.update({ id: edge.id, color: { color: color, highlight: color }, width: width });
            } else {
                console.warn("Could not find edge to highlight:", edgeId);
            }// js/visualizer.js

class GraphVisualizer {
    constructor(containerId, graphInstance) {
        this.container = document.getElementById(containerId);
        this.graphInstance = graphInstance; // Reference to the Graph class instance
        this.visNodes = new vis.DataSet();
        this.visEdges = new vis.DataSet();
        this.animationSpeed = 500; // ms
        this.isPaused = false;
        this.stepPromise = null;
        this.stepResolve = null;

        const options = {
            layout: {
                hierarchical: false, // Or true if you prefer, with additional direction settings
                improvedLayout: true, // Generally good to keep true
            },
            nodes: {
                shape: 'dot', // e.g., 'ellipse', 'circle', 'database', 'box', 'text', 'image', 'circularImage', 'diamond', 'dot', 'star', 'triangle', 'triangleDown', 'hexagon', 'square'
                size: 18,     // Default size for 'dot' shape, adjust if using other shapes
                font: {
                    size: 15,
                    color: '#343a40', // Darker text for better readability
                    face: 'Roboto, Open Sans, Arial, sans-serif',
                    strokeWidth: 0, // No outline for text
                    strokeColor: '#ffffff'
                },
                borderWidth: 2.5,
                borderWidthSelected: 3, // Border width when node is selected by vis.js interaction
                color: { // Default node colors
                    border: '#007bff',       // Primary blue
                    background: '#e7f3ff',   // Light blue
                    highlight: {
                        border: '#0056b3',       // Darker primary blue
                        background: '#cce5ff'    // Slightly darker light blue
                    },
                    hover: {
                        border: '#0069d9',
                        background: '#d8eaff'
                    }
                },
                shadow: { // Subtle shadow for nodes
                    enabled: true,
                    color: 'rgba(0,0,0,0.1)',
                    size: 5,
                    x: 2,
                    y: 2
                }
            },
            edges: {
                width: 2.5,
                color: {
                    color: '#6c757d',       // Muted grey for edges
                    highlight: '#5a6268',   // Darker grey for selection/traversal
                    hover: '#5a6268',
                    opacity: 1.0
                },
                arrows: {
                    to: { enabled: false, scaleFactor: 0.8, type: 'arrow' } // Default, updated by graph type
                },
                smooth: {
                    enabled: true,
                    type: "dynamic", // 'dynamic', 'continuous', 'cubicBezier' (default)
                    roundness: 0.5
                },
                font: {
                    color: '#343a40',
                    size: 12,
                    face: 'Roboto, Open Sans, Arial, sans-serif',
                    align: 'middle', // 'horizontal', 'top', 'middle', 'bottom'
                    strokeWidth: 3,   // White stroke for readability against edge
                    strokeColor: '#ffffff',
                    background: 'rgba(255,255,255,0.7)' // Slight background for label
                },
                selectionWidth: 1.5, // How much wider edge becomes when selected
                 hoverWidth: 1.1, // How much wider edge becomes on hover
            },
            physics: {
                enabled: true,
                barnesHut: {
                    gravitationalConstant: -5000, // Increased pull apart
                    centralGravity: 0.15,        // Pull towards center
                    springLength: 130,          // Ideal edge length
                    springConstant: 0.05,       // Edge stiffness
                    damping: 0.15,              // Slows down movement
                    avoidOverlap: 0.3           // How much to avoid node overlap (0 to 1)
                },
                solver: 'barnesHut', // 'repulsion', 'hierarchicalRepulsion', 'forceAtlas2Based'
                stabilization: {
                    enabled: true,
                    iterations: 1000, // Default: 1000
                    updateInterval: 50,
                    onlyDynamicEdges: false,
                    fit: true
                }
            },
            interaction: {
                hover: true,            // Enable hover effects
                hoverConnectedEdges: true, // Highlight connected edges on node hover
                tooltipDelay: 200,
                navigationButtons: false, // Set to true to show zoom buttons etc.
                keyboard: {             // Enable keyboard navigation (zoom with +/-)
                    enabled: true,
                    speed: {x:10,y:10,zoom:0.05},
                    bindToWindow: true
                },
                dragNodes: true,
                dragView: true,
                zoomView: true,
                multiselect: true,      // Allow selecting multiple nodes with Ctrl/Shift
                selectable: true,
                selectConnectedEdges: true,
            },
            manipulation: { enabled: false }, // Disable vis.js built-in editing GUI
        };
        this.network = new vis.Network(this.container, { nodes: this.visNodes, edges: this.visEdges }, options);

        // Bind animation state change colors (example for the highlightNode function later)
        // These are conceptual, the actual color values are in highlightNode/Edge
        this.nodeColors = {
            default: { border: options.nodes.color.border, background: options.nodes.color.background },
            visiting: { border: '#FFA500', background: '#FFD700' }, // Orange/Gold
            backtrack: { border: '#DC143C', background: '#FFB6C1' }, // Crimson/LightPink
            current: { border: '#32CD32', background: '#90EE90' }, // LimeGreen/LightGreen
            path_node: { border: '#1E90FF', background: '#ADD8E6' } // DodgerBlue/LightBlue
        };
        this.edgeColors = {
            default: options.edges.color.color,
            traversing: '#FFA500', // Orange
            path_edge: '#1E90FF'   // DodgerBlue
        };

    }

    setAnimationSpeed(speed) {
        this.animationSpeed = speed;
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        if (!this.isPaused && this.stepResolve) {
            this.stepResolve();
            this.stepPromise = null;
            this.stepResolve = null;
        }
        return this.isPaused;
    }

    async step() {
        if (this.isPaused) {
            if (this.stepResolve) this.stepResolve();
            this.stepPromise = new Promise(resolve => { this.stepResolve = resolve; });
            await this.stepPromise;
        } else {
            await sleep(this.animationSpeed);
        }
    }

    forceStepForward() {
        if (this.isPaused && this.stepResolve) {
            this.stepResolve();
            this.stepPromise = new Promise(resolve => { this.stepResolve = resolve; });
        }
    }


    drawGraph(isDirected) {
        const nodesData = this.graphInstance.getAllNodes().map(node => ({
            id: node.id,
            label: String(node.label)
            // Default colors/shape will come from options, can override here if needed per node
        }));
        const edgesData = this.graphInstance.getAllEdges(isDirected).map(edge => ({
            id: edge.id,
            from: edge.from,
            to: edge.to,
            label: String(edge.weight),
            arrows: isDirected ? { to: { enabled: true, scaleFactor: 0.8, type: 'arrow' } } : undefined,
            value: edge.weight // for potential scaling if needed
        }));

        this.visNodes.clear();
        this.visEdges.clear();
        this.visNodes.add(nodesData);
        this.visEdges.add(edgesData);
        
        // Update edge arrows based on current graph type directly in options
        // This ensures new edges added also respect this if drawGraph isn't called immediately
        let currentOptions = this.network.getOptions();
        currentOptions.edges.arrows.to.enabled = isDirected;
        this.network.setOptions(currentOptions);

        this.network.fit();
    }

    highlightNode(nodeId, type = 'default') {
        let colorConfig = this.nodeColors[type] || this.nodeColors.default;
        try {
            this.visNodes.update({ id: nodeId, color: colorConfig });
        } catch (e) {
            console.warn(`Node ${nodeId} not found for highlighting.`);
        }
    }

    highlightEdge(edgeId, type = 'default') {
        let edgeColor = this.edgeColors[type] || this.edgeColors.default;
        let edgeWidth = (type === 'traversing' || type === 'path_edge') ? 3.5 : 2.5; // Use default from options or make thicker
        
        const updatePayload = {
            id: edgeId,
            color: { color: edgeColor, highlight: edgeColor }, // Ensure highlight matches
            width: edgeWidth
        };

        try {
            this.visEdges.update(updatePayload);
        } catch (e) {
            // Attempt to find edge by from/to if ID direct match fails (common with undirected representations)
            const edgeObj = this.graphInstance.getAllEdges(dfsPathFinder.isGraphDirected).find(e => e.id === edgeId);
            if(edgeObj){
                // vis.js might have a slightly different internal ID if it coalesced undirected edges
                const visEdge = this.visEdges.get({
                    filter: function (item) {
                        return (item.from === edgeObj.from && item.to === edgeObj.to) ||
                               (item.from === edgeObj.to && item.to === edgeObj.from && !dfsPathFinder.isGraphDirected);
                    }
                })[0]; // Get the first match

                if(visEdge){
                    updatePayload.id = visEdge.id; // Use the ID vis.js knows
                     this.visEdges.update(updatePayload);
                } else {
                     console.warn("Could not find edge in vis.js to highlight:", edgeId, edgeObj);
                }
            } else {
                 console.warn("Could not find edge definition to highlight:", edgeId);
            }
        }
    }

    resetHighlights() {
        // Reset nodes to their default appearance defined in options
        const nodeUpdates = this.visNodes.getIds().map(id => ({
            id: id,
            color: this.nodeColors.default // Use stored default colors
        }));
        if (nodeUpdates.length > 0) this.visNodes.update(nodeUpdates);

        // Reset edges to their default appearance
        const edgeUpdates = this.visEdges.getIds().map(id => ({
            id: id,
            color: { color: this.edgeColors.default, highlight: this.edgeColors.default },
            width: 2.5 // Default width from options
        }));
        if (edgeUpdates.length > 0) this.visEdges.update(edgeUpdates);
    }

    highlightCompletePath(pathNodes, pathEdges) {
        pathNodes.forEach(nodeId => this.highlightNode(nodeId, 'path_node'));
        pathEdges.forEach(edgeId => this.highlightEdge(edgeId, 'path_edge'));
    }
}
        }
    }

    resetHighlights() {
        const nodeUpdates = this.visNodes.getIds().map(id => ({
            id: id,
            color: { border: '#2B7CE9', background: '#97C2FC' }
        }));
        if (nodeUpdates.length > 0) this.visNodes.update(nodeUpdates);

        const edgeUpdates = this.visEdges.getIds().map(id => ({
            id: id,
            color: { color: '#848484', highlight: '#848484' },
            width: 1
        }));
        if (edgeUpdates.length > 0) this.visEdges.update(edgeUpdates);
    }

    highlightCompletePath(pathNodes, pathEdges) { // pathNodes is array of node IDs, pathEdges is array of edge IDs
        pathNodes.forEach(nodeId => this.highlightNode(nodeId, 'path_node'));
        pathEdges.forEach(edgeId => this.highlightEdge(edgeId, 'path_edge'));
    }
}