const fs = require('fs');

let data = JSON.parse(fs.readFileSync('./data.json'));

var buildMapWithDependencies = (data) => {
    let dependencyMap = new Map();
    let regexp = /Step\ ([A-Z])\ must\ be\ finished\ before\ step\ ([A-Z])\ can\ begin./;
    data.forEach(element => {
        let extract = element.match(regexp);
        if (dependencyMap.get(extract[2])) {
            dependencyMap.get(extract[2]).push(extract[1]);
        } else {
            dependencyMap.set(extract[2], [extract[1]]);
        }
        if (!dependencyMap.get(extract[1])) {
            dependencyMap.set(extract[1], []);
        }
    });
    return dependencyMap;
}

var getFirstStepWithoutDependencies = (map) => {
    let steps = [];
    for (let entry of map.entries()) {
        if (entry[1].length === 0) {
            steps.push(entry[0]);
        }
    }
    return steps.sort()[0];
}

var clearDependencyMap = (step, map) => {
    map.delete(step);
    for (let entry of map.entries()) {
        map.set(entry[0], map.get(entry[0]).filter(value => value !== step));
    }
    return map;
}

var createExecutionOrder = (map) => {
    let steps = [];
    while (map.size > 0) {
        let step = getFirstStepWithoutDependencies(map);
        map = clearDependencyMap(step, map);
        steps.push(step);
    }
    return steps;
}

let map = buildMapWithDependencies(data);
let result = createExecutionOrder(map);
console.log(result.join(''));
