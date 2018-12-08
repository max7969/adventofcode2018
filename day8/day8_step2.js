const fs = require('fs');

let data = JSON.parse(fs.readFileSync('./data.json'));

var createNode = (data) => {
    let node = { "childCount": data[0], "metadataCount": data[1], "childs": [], "metadata": [] };
    data.splice(0, 2);
    for (let i = 0; i < node.childCount; i++) {
        let childNode = createNode(data);
        node.childs.push(childNode);
        if (childNode.childCount === 0) {
            childNode.metadata = data.splice(0, childNode.metadataCount);
        }
    }
    if (node.childCount > 0) {
        node.metadata = data.splice(0, node.metadataCount);
    }
    return node;
}

var computeNodeValue = (node) => {
    if (node.childCount === 0) {
        return node.metadata.reduce((a, b) => a + b);
    }
    return node.metadata.reduce((value, element) =>
        node.childs[element - 1] ? value + computeNodeValue(node.childs[element - 1]) : value, 0);
}

let parentNode = createNode(data);
let value = computeNodeValue(parentNode);
console.log(value);