class DFSPathFinder {
    constructor(graph, visualizer) {
        this.graph = graph;
        this.visualizer = visualizer;
        this.allPaths = [];
        this.isGraphDirected = false; // Will be set from app.js
    }

    async _findAllPathsUtil(u, d, visited, currentPath, currentPathEdges, currentCost) {
        visited.add(u);
        currentPath.push(u);
        if (this.visualizer) {
            this.visualizer.highlightNode(u, 'visiting');
            await this.visualizer.step();
        }

        if (u === d) {
            this.allPaths.push({ path: [...currentPath], edges: [...currentPathEdges], cost: currentCost });
            if (this.visualizer) {
                this.visualizer.highlightCompletePath(currentPath, currentPathEdges);
                await sleep(this.visualizer.animationSpeed * 2);
            }
        } else {
            const neighbors = this.graph.getNeighbors(u);
            for (const edge of neighbors) {
                const v = edge.node;
                const weight = edge.weight;
                const edgeId = edge.id;

                if (!visited.has(v)) {
                    if (this.visualizer) {
                        this.visualizer.highlightEdge(edgeId, 'traversing');
                        await this.visualizer.step();
                    }
                    currentPathEdges.push(edgeId);
                    await this._findAllPathsUtil(v, d, visited, currentPath, currentPathEdges, currentCost + weight);
                    currentPathEdges.pop();
                     if (this.visualizer) {
                        this.visualizer.highlightEdge(edgeId);
                    }
                }
            }
        }

        currentPath.pop();
        visited.delete(u);
        if (this.visualizer) {
            this.visualizer.highlightNode(u, 'backtrack');
            await this.visualizer.step();
            this.visualizer.highlightNode(u);
        }
    }

    async findAllPaths(startNodeId, endNodeId) {
        if (!this.graph.getNode(startNodeId) || !this.graph.getNode(endNodeId)) {
            console.error("Source or Destination node does not exist.");
            return [];
        }

        this.allPaths = [];
        const visited = new Set();
        const currentPath = [];
        const currentPathEdges = [];

        if (this.visualizer) this.visualizer.resetHighlights();

        await this._findAllPathsUtil(startNodeId, endNodeId, visited, currentPath, currentPathEdges, 0);
        
        if (this.visualizer) this.visualizer.resetHighlights();
        return this.allPaths;
    }
}