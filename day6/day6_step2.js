const fs = require('fs');

let data = JSON.parse(fs.readFileSync('./data.json'));

var getMaxX = (data) => {
    return data.reduce((a, b) => b.x > a ? b.x : a, 0);
}

var getMaxY = (data) => {
    return data.reduce((a, b) => b.y > a ? b.y : a, 0);
}

var computeManhatanDistance = (a, b) => {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

var sumManhatanDistanceFromAllCoordinates = (point, coordinates) => {
    return coordinates.reduce((sum, coordinate) => sum + computeManhatanDistance(point, coordinate), 0);
}

var countSafePoints = (maxX, maxY, coordinates) => {
    let countSafePoints = 0;
    for (let i = 0; i < maxX; i++) {
        for (let j = 0; j < maxY; j++) {
            if (sumManhatanDistanceFromAllCoordinates({ "x": i, "y": j }, coordinates) < 10000) {
                countSafePoints++;
            }
        }
    }
    return countSafePoints;
}

let maxX = getMaxX(data);
let maxY = getMaxY(data);

console.log(countSafePoints(maxX, maxY, data));