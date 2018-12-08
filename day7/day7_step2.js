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

var getFirstStepUnassignedWithoutDependencies = (map, assignedSteps) => {
    let steps = [];
    for (let entry of map.entries()) {
        if (entry[1].length === 0) {
            steps.push(entry[0]);
        }
    }
    return steps.filter(step => !assignedSteps.get(step)).sort()[0];
}

var clearDependencyMapByStep = (step, map) => {
    map.delete(step);
    for (let entry of map.entries()) {
        map.set(entry[0], map.get(entry[0]).filter(value => value !== step));
    }
    return map;
}

var clearDependencyMap = (steps, map, time) => {
    for (let entry of steps.entries()) {
        if (entry[1] === time) {
            map = clearDependencyMapByStep(entry[0], map);
        }
    }
    return map;
}

var getTimeNeeded = (step) => {
    return step.charCodeAt(0) % 64 + 60;
}

var computeTimeSpent = (map) => {
    let workers = [0, 0, 0, 0, 0];
    let time = -1;
    let stepsToClear = new Map();
    while (map.size > 0) {
        time++;
        map = clearDependencyMap(stepsToClear, map, time);
        workers.forEach((worker, index) => {
            if (map.size > 0 && worker <= time) {
                let step = getFirstStepUnassignedWithoutDependencies(map, stepsToClear);
                if (step) {
                    workers[index] = time + getTimeNeeded(step);
                    stepsToClear.set(step, time + getTimeNeeded(step));
                }
            }
        });
    }
    return time;
}

console.log(computeTimeSpent(buildMapWithDependencies(data)));