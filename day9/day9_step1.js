const fs = require('fs');

let data = JSON.parse(fs.readFileSync('./day9/data.json'));

var readRules = (data) => {
    let regexp = /([0-9]*)\ players\;\ last\ marble\ is\ worth\ ([0-9]*)\ points/;
    let extract = data.match(regexp);
    return { "players": parseInt(extract[1]), "lastMarble": parseInt(extract[2]) };
}

var getNextMarblePos = (circle, currentPos) => {
    return (currentPos + 2) % circle.length;
}

var getMarblePosToRemove = (circle, currentPos) => {
    return (((currentPos - 7) % circle.length) + circle.length) % circle.length;
}

var playMarbleUntilTheEnd = (playersCount, lastMarble) => {
    let players = new Array(playersCount).fill(0);
    let circle = [0];
    let currentPos = 0;
    for (let i = 1; i <= lastMarble; i++) {
        if (i % 23 === 0) {
            players[(i - 1) % playersCount] += i;
            currentPos = getMarblePosToRemove(circle, currentPos);
            players[(i - 1) % playersCount] += circle[currentPos];
            circle.splice(currentPos, 1);
        } else {
            currentPos = getNextMarblePos(circle, currentPos);
            circle.splice(currentPos, 0, i);
        }
    }
    return players;
}

let rules = readRules(data);
console.log(Math.max(...playMarbleUntilTheEnd(rules.players, rules.lastMarble)));