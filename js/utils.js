function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function generateEdgeId(from, to, count = 0) {
    return `edge_${from}_${to}_${count}`;
}


