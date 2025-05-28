class Graph {
    constructor() {
        this.nodes = new Map(); // Store node objects (id, label, etc.)
        this.adj = new Map();   // Adjacency list: node_id -> [{node: neighbor_id, weight: number, edgeId: string}]
        this.edgeCount = 0; // For unique edge IDs if multiple edges between same nodes
    }

    addNode(id, label = id) {
        if (!this.nodes.has(id)) {
            this.nodes.set(id, { id, label });
            this.adj.set(id, []);
            return true;
        }
        return false; // Node already exists
    }

    addEdge(from, to, weight = 1, isDirected = false, edgeId = null) {
        if (!this.nodes.has(from) || !this.nodes.has(to)) {
            console.error("One or both nodes do not exist.");
            return null;
        }

        const newEdgeId = edgeId || generateEdgeId(from, to, this.edgeCount++);
        
        this.adj.get(from).push({ node: to, weight: parseInt(weight, 10), id: newEdgeId });

        if (!isDirected) {
             const reverseEdgeId = edgeId || generateEdgeId(to, from, this.edgeCount -1);
            this.adj.get(to).push({ node: from, weight: parseInt(weight, 10), id: newEdgeId });
        }
        return { id: newEdgeId, from, to, weight };
    }

    getNeighbors(nodeId) {
        return this.adj.get(nodeId) || [];
    }

    getNode(nodeId) {
        return this.nodes.get(nodeId);
    }

    getAllNodes() {
        return Array.from(this.nodes.values());
    }

    getAllEdges(isDirected = false) {
        const edges = [];
        const addedEdgeIds = new Set(); // To avoid duplicates in undirected graphs for vis.js

        for (const [fromNode, neighbors] of this.adj) {
            for (const edge of neighbors) {
                if (isDirected || !addedEdgeIds.has(edge.id)) {
                    edges.push({
                        id: edge.id,
                        from: fromNode,
                        to: edge.node,
                        label: String(edge.weight),
                        arrows: isDirected ? 'to' : undefined,
                        weight: edge.weight
                    });
                    if (!isDirected) {
                        addedEdgeIds.add(edge.id);
                    }
                }
            }
        }
        return edges;
    }

    reset() {
        this.nodes.clear();
        this.adj.clear();
        this.edgeCount = 0;
    }
}