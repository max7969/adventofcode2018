const fs = require('fs');

let data = JSON.parse(fs.readFileSync('./data.json'));

var readMap = (data, attack) => {
    let fighters = [];
    let map = [];
    data.forEach((line, index) => {
        map.push(line.split(''));
        map[index].forEach((element, elementIndex) => {
            if (element === "E") {
                fighters.push({ "hp": 200, "attack": attack, "x": elementIndex, "y": index, "type": element });
            } else if (element === "G") {
                fighters.push({ "hp": 200, "attack": 3, "x": elementIndex, "y": index, "type": element });
            }
        })
    });
    return { "map": map, "fighters": fighters };
}

var extractCoordsOfElements = (map) => {
    let elves = [];
    let goblins = [];
    let walls = [];
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (map[i][j] === "#") {
                walls.push({ "x": j, "y": i });
            } else if (map[i][j] === "E") {
                elves.push({ "x": j, "y": i });
            } else if (map[i][j] === "G") {
                goblins.push({ "x": j, "y": i });
            }
        }
    }
    return { "elves": elves, "goblins": goblins, "walls": walls };
}

var formatCoord = (coord) => {
    return coord.x + "," + coord.y;
}

var getNextMove = (location, ennemies, walls) => {
    let previousMove = new Map();
    let distance = new Map();
    let coordsToVisit = [];
    let increments = [{ "x": 0, "y": -1 }, { "x": -1, "y": 0 }, { "x": 1, "y": 0 }, { "x": 0, "y": 1 }];

    for (increment of increments) {
        let newCoord = { "x": location.x + increment.x, "y": location.y + increment.y };
        coordsToVisit.push(newCoord);
        previousMove.set(formatCoord(newCoord), location);
        distance.set(formatCoord(newCoord), 1);
    }
    let closest;
    while (coordsToVisit.length > 0) {
        currentCoord = coordsToVisit.shift();

        if (ennemies.filter(e => e.x === currentCoord.x && e.y === currentCoord.y).length > 0) {
            closest = currentCoord;
            break;
        }
        if (walls.filter(w => w.x === currentCoord.x && w.y === currentCoord.y).length === 0) {
            for (increment of increments) {
                let newCoord = { "x": currentCoord.x + increment.x, "y": currentCoord.y + increment.y };
                if (!previousMove.get(formatCoord(newCoord))) {
                    previousMove.set(formatCoord(newCoord), currentCoord);
                    distance.set(formatCoord(newCoord), distance.get(formatCoord(currentCoord)) + 1);
                    coordsToVisit.push(newCoord);
                }
            }
        }
    }
    if (!closest) {
        return { "closest": {}, "location": location, "dist": -1 };
    }
    let newLocation = closest;
    let nextMove = previousMove.get(formatCoord(closest));
    while (nextMove !== location) {
        newLocation = nextMove;
        nextMove = previousMove.get(formatCoord(newLocation));
    }
    return { "closest": closest, "location": newLocation, "dist": distance.get(formatCoord(closest)) };
}

var moveFighter = (fighter, map, fighters) => {
    let elements = extractCoordsOfElements(map);
    let newMove;
    if (fighter.type === "E") {
        newMove = getNextMove(fighter, elements.goblins, elements.walls.concat(elements.elves).concat(elements.goblins));
    } else {
        newMove = getNextMove(fighter, elements.elves, elements.walls.concat(elements.elves).concat(elements.goblins));
    }
    if (newMove.dist > 1) {
        map[fighter.y][fighter.x] = ".";
        map[newMove.location.y][newMove.location.x] = fighter.type;
        fighter.x = newMove.location.x;
        fighter.y = newMove.location.y;
    }
}

var sortFighters = (fighters) => {
    fighters.sort((a, b) => (a.y * 100 + a.x) - (b.y * 100 + b.x));
}

var selectOpponent = (fighter, fighters) => {
    fightersInRange = fighters.filter(f => Math.abs(f.x - fighter.x) + Math.abs(f.y - fighter.y) === 1 && f.type !== fighter.type && f.hp > 0);
    fightersInRange.sort((a, b) => a.hp - b.hp);
    return fightersInRange.length > 0 ? fightersInRange[0] : null;
}

var fightOpponent = (fighter, opponent, fighters, map) => {
    let index = fighters.indexOf(opponent);
    opponent.hp -= fighter.attack;
    if (opponent.hp <= 0) {
        map[opponent.y][opponent.x] = ".";
    }
    fighters[index] = opponent;
}

var clearFighters = (fighters) => {
    return fighters.filter(f => f.hp > 0);
}

var allFighterAliveSameType = (fighters) => {
    return fighters.filter(fighter => fighter.type === "E" && fighter.hp > 0).length === 0
        || fighters.filter(fighter => fighter.type === "G" && fighter.hp > 0).length === 0;
}

var playTurn = (map, fighters) => {
    let complete = true;
    sortFighters(fighters);
    for (let i = 0; i < fighters.length; i++) {
        if (allFighterAliveSameType(fighters)) {
            complete = false;
            break;
        }
        if (fighters[i].hp > 0) {
            moveFighter(fighters[i], map, fighters);
            let opponent = selectOpponent(fighters[i], fighters);
            if (opponent) {
                fightOpponent(fighters[i], opponent, fighters, map);
            }
        }

    }
    fighters = clearFighters(fighters);
    return complete;
}

var fightUntilTheEnd = (map, fighters) => {
    let count = 0;
    while (!allFighterAliveSameType(fighters)) {
        let complete = playTurn(map, fighters);
        fighters = clearFighters(fighters);
        if (complete) {
            count++;
        }
    }
    return { "outcome": fighters.reduce((sum, fighter) => sum + fighter.hp, 0) * count, "elvesCount": fighters.filter(f => f.type === "E").length };
}

var findVictoriousOutcomeForElves = (data) => {
    let attackPower = 3
    let state = readMap(data, attackPower);
    let elvesCount = state.fighters.filter(f => f.type === "E").length;
    let elvesAlive = 0;
    let outcome = {};
    while (elvesAlive < elvesCount) {
        state = readMap(data, attackPower++);
        outcome = fightUntilTheEnd(state.map, state.fighters);
        elvesAlive = outcome.elvesCount;
    }
    return outcome;
}

console.log(findVictoriousOutcomeForElves(data));
