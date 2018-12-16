const fs = require('fs');

let data = JSON.parse(fs.readFileSync('./day15/data.json'));

function Graph(node) {
    this.head = node;
    this.knownNodes = new Map();
    this.knownNodes.set(node.x + "," + node.y, node);
}

function Node(x, y) {
    this.x = x;
    this.y = y;
    this.neighbors = [];
    this.weight = 0;
    this.nearEnnemy = false;
};

var readMap = (data) => {
    let fighters = [];
    let map = [];
    data.forEach((line, index) => {
        map.push(line.split(''));
        map[index].forEach((element, elementIndex) => {
            if (element === "E" || element === "G") {
                fighters.push({ "hp": 200, "attack": 3, "x": elementIndex, "y": index, "type": element });
            }
        })
    });
    return { "map": map, "fighters": fighters };
}

var buildGraphArroundLocation = (location, map, ennemyType) => {
    let graph = new Graph(new Node(location.x, location.y));
    findNeighbors(graph.head, map, graph, ennemyType);
    return graph;
}

var findNeighbors = (node, map, graph, ennemyType) => {
    let neighbors = extractDirectNeighbors(node, graph, map);
    updateNodeIfEnnemy(node, map, graph, ennemyType);

    let unknownNeightbors = neighbors.filter(neighbor => !graph.knownNodes.get(neighbor.x + "," + neighbor.y));
    let knownNeighbors = neighbors.filter(neighbor => graph.knownNodes.get(neighbor.x + "," + neighbor.y));

    let minWeightNeighbors = Math.min(...knownNeighbors.map(neighbor => neighbor.weight));

    let weight = node.weight;
    if ((minWeightNeighbors + 1) < weight) {
        node.weight = minWeightNeighbors + 1;
    }
    knownNeighbors.forEach(known => {
        graph.knownNodes.get(known.x + "," + known.y).weight = known.weight > node.weight + 1 ? node.weight + 1 : known.weight;
    });
    unknownNeightbors.forEach(unknown => {
        unknown.weight = node.weight + 1;
        graph.knownNodes.set(unknown.x + "," + unknown.y, unknown);
    });
    unknownNeightbors.forEach(unknown => findNeighbors(unknown, map, graph, ennemyType));
}

var extractDirectNeighbors = (node, graph, map) => {
    let neighbors = [];
    if (map[node.y][node.x - 1] === ".") {
        neighbors.push(!graph.knownNodes.get((node.x - 1) + "," + node.y) ? new Node(node.x - 1, node.y) : graph.knownNodes.get((node.x - 1) + "," + node.y));
    }
    if (map[node.y][node.x + 1] === ".") {
        neighbors.push(!graph.knownNodes.get((node.x + 1) + "," + node.y) ? new Node(node.x + 1, node.y) : graph.knownNodes.get((node.x + 1) + "," + node.y));
    }
    if (map[node.y - 1][node.x] === ".") {
        neighbors.push(!graph.knownNodes.get(node.x + "," + (node.y - 1)) ? new Node(node.x, node.y - 1) : graph.knownNodes.get(node.x + "," + (node.y - 1)));
    }
    if (map[node.y + 1][node.x] === ".") {
        neighbors.push(!graph.knownNodes.get(node.x + "," + (node.y + 1)) ? new Node(node.x, node.y + 1) : graph.knownNodes.get(node.x + "," + (node.y + 1)));
    }
    return neighbors;
}

var updateNodeIfEnnemy = (node, map, graph, ennemyType) => {
    if (map[node.y][node.x - 1] === ennemyType
        || map[node.y][node.x + 1] === ennemyType
        || map[node.y - 1][node.x] === ennemyType
        || map[node.y + 1][node.x] === ennemyType) {
        graph.knownNodes.get(node.x + "," + node.y).nearEnnemy = true;
    }
}

var getClosestEnemyPosWeigth = (graph) => {
    let nodesNearEnnemies = Array.from(graph.knownNodes.values()).filter(node => node.nearEnnemy === true);
    return Math.min(...nodesNearEnnemies.map(node => node.weight));
};

var sortFighters = (fighters) => {
    fighters.sort((a, b) => (a.y * 10 + a.x) - (b.y * 10 + b.x));
}

var getFighterInRange = (fighter, fighters) => {
    fightersInRange = fighters.filter(f => Math.abs(f.x - fighter.x) + Math.abs(f.y - fighter.y) === 1 && f.type !== fighter.type && f.hp > 0);
    fightersInRange.sort((a, b) => a.hp - b.hp);
    return fightersInRange;
}

var moveFighter = (fighter, map) => {
    let possiblePosition = [];
    if (map[fighter.y - 1][fighter.x] === ".") {
        possiblePosition.push({ "x": fighter.x, "y": fighter.y - 1, "cost": 0 });
    }
    if (map[fighter.y][fighter.x - 1] === ".") {
        possiblePosition.push({ "x": fighter.x - 1, "y": fighter.y, "cost": 0 });
    }
    if (map[fighter.y][fighter.x + 1] === ".") {
        possiblePosition.push({ "x": fighter.x + 1, "y": fighter.y, "cost": 0 });
    }
    if (map[fighter.y + 1][fighter.x] === ".") {
        possiblePosition.push({ "x": fighter.x, "y": fighter.y + 1, "cost": 0 });
    }
    possiblePosition.forEach(position => {
        let graph = buildGraphArroundLocation(position, map, fighter.type === "G" ? "E" : "G");
        cleanWeigth(graph);
        printGraph(graph, map);
        position.cost = getClosestEnemyPosWeigth(graph);
    });
    possiblePosition = possiblePosition.sort((a, b) => a.y * 10 + a.x - b.y * 10 + b.x).sort((a, b) => a.cost - b.cost).filter(pos => pos.cost < (1 / 0));
    if (possiblePosition.length > 0) {
        map[fighter.y][fighter.x] = ".";
        map[possiblePosition[0].y][possiblePosition[0].x] = fighter.type;
        fighter.x = possiblePosition[0].x;
        fighter.y = possiblePosition[0].y;
    }
}

var printGraph = (graph, map) => {
    for (let i = 0; i < map.length; i++) {
        let str = "";
        for (let j = 0; j < map[i].length; j++) {
            if (Array.from(graph.knownNodes.values()).filter(n => n.x === j && n.y === i).length > 0) {
                str = str.concat("|" + ("00" + Array.from(graph.knownNodes.values()).filter(n => n.x === j && n.y === i)[0].weight).slice(-3) + "|");
            } else {
                str = str.concat("|...|")
            }
        }
        console.log(str);
    }
    console.log("===================================");
}

var cleanWeigth = (graph) => {
    for (let i = 0; i < Array(graph.knownNodes.values()).length + 1; i++) {
        Array.from(graph.knownNodes.values()).sort((a, b) => a.weight - b.weight).forEach(node => {
            if (graph.knownNodes.get((node.x - 1) + "," + node.y) &&
                graph.knownNodes.get(node.x + "," + node.y).weight > graph.knownNodes.get((node.x - 1) + "," + node.y).weight + 1) {
                graph.knownNodes.get(node.x + "," + node.y).weight = graph.knownNodes.get((node.x - 1) + "," + node.y).weight + 1;
            }
            if (graph.knownNodes.get((node.x + 1) + "," + node.y) &&
                graph.knownNodes.get(node.x + "," + node.y).weight > graph.knownNodes.get((node.x + 1) + "," + node.y).weight + 1) {
                graph.knownNodes.get(node.x + "," + node.y).weight = graph.knownNodes.get((node.x + 1) + "," + node.y).weight + 1;
            }
            if (graph.knownNodes.get(node.x + "," + (node.y - 1)) &&
                graph.knownNodes.get(node.x + "," + node.y).weight > graph.knownNodes.get(node.x + "," + (node.y - 1)).weight + 1) {
                graph.knownNodes.get(node.x + "," + node.y).weight = graph.knownNodes.get(node.x + "," + (node.y - 1)).weight + 1;
            }
            if (graph.knownNodes.get(node.x + "," + (node.y + 1)) &&
                graph.knownNodes.get(node.x + "," + node.y).weight > graph.knownNodes.get(node.x + "," + (node.y + 1)).weight + 1) {
                graph.knownNodes.get(node.x + "," + node.y).weight = graph.knownNodes.get(node.x + "," + (node.y + 1)).weight + 1;
            }
        });
    }
}

var printFighters = (fighters, map) => {
    for (let i = 0; i < map.length; i++) {
        let str = "";
        for (let j = 0; j < map[i].length; j++) {
            if (fighters.filter(f => f.x === j && f.y === i).length > 0) {
                str = str.concat("|" + ("00" + fighters.filter(f => f.x === j && f.y === i)[0].hp).slice(-3) + "|");
            } else {
                str = str.concat("|...|")
            }
        }
        console.log(str);
    }
    console.log("===================================");
}

var fightOpponent = (opponent, fighters, map) => {
    let index = fighters.indexOf(opponent);
    opponent.hp -= 3;
    if (opponent.hp > 0) {
        fighters[index] = opponent;
    } else {
        map[opponent.y][opponent.x] = ".";
    }
}

var clearFighters = (fighters) => {
    return fighters.filter(f => f.hp > 0);
}

var print = (map) => {
    for (let i = 0; i < map.length; i++) {
        console.log(map[i].join(''));
    }
}

var allFighterSameType = (fighters) => {
    return fighters.filter(fighter => fighter.type === "E").length === 0
        || fighters.filter(fighter => fighter.type === "G").length === 0;
}

var fightUntilTheEnd = (map, fighters) => {
    let count = 0;
    print(map);
    while (!allFighterSameType(fighters)) {
        sortFighters(fighters);
        fighters.forEach(fighter => {
            if (fighter.hp > 0) {
                let opponentsInRange = getFighterInRange(fighter, fighters);
                if (opponentsInRange.length === 0) {
                    moveFighter(fighter, map);
                    opponentsInRange = getFighterInRange(fighter, fighters);
                    if (opponentsInRange.length > 0) {
                        fightOpponent(opponentsInRange[0], fighters, map);
                    }
                } else {
                    fightOpponent(opponentsInRange[0], fighters, map);
                }
            }
            //printFighters(fighters, map);
        });
        fighters = clearFighters(fighters);
        if (!allFighterSameType(fighters)) {
            count++;
        }
    }
    return fighters.reduce((sum, fighter) => sum + fighter.hp, 0) * count;
}

let state = readMap(data);
console.log(fightUntilTheEnd(state.map, state.fighters));
