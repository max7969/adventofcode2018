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

var getUniqueClosestPoint = (point, referencePoints) => {
    let closestPoints = referencePoints.reduce((closestPoints, currentPoint) => {
        if (closestPoints.length === 0) {
            closestPoints.push(currentPoint);
        } else if (computeManhatanDistance(currentPoint, point) === computeManhatanDistance(closestPoints[0], point)) {
            closestPoints.push(currentPoint);
        } else if (computeManhatanDistance(currentPoint, point) < computeManhatanDistance(closestPoints[0], point)) {
            closestPoints = [currentPoint];
        }
        return closestPoints;
    }, []);
    return closestPoints.length === 1 ? closestPoints[0] : {};
}

var buildMapWithAssociatedPoints = (data, maxX, maxY) => {
    let pointsByCoordinates = new Map();
    for (let i=0; i < maxX; i++) {
        for (let j=0; j < maxY; j++) {
            let point = { "x": i, "y": j };
            let closestPoint = getUniqueClosestPoint(point, data);
            if (closestPoint.x && closestPoint.y) {
                if (pointsByCoordinates.get(closestPoint)) {
                    pointsByCoordinates.get(closestPoint).associatePoints.push(point);
                } else {
                    pointsByCoordinates.set(closestPoint, { "associatePoints": [point] });
                }
            }
        }
    }
    return pointsByCoordinates;
}

var filterInfinites = (originalData, map, maxX, maxY) => {
    let pointsToRemove = new Set();
    for (let i = 0; i < maxX; i++) {
        pointsToRemove.add(getUniqueClosestPoint({ "x": i, "y": -1 }, originalData));
        pointsToRemove.add(getUniqueClosestPoint({ "x": i, "y": maxY+1 }, originalData));
    }
    for (let i = 0; i < maxY; i++) {
        pointsToRemove.add(getUniqueClosestPoint({ "x": -1, "y": i }, originalData));
        pointsToRemove.add(getUniqueClosestPoint({ "x": maxX+1, "y": i }, originalData));
    }
    pointsToRemove.forEach(element => {
        map.delete(element);
    });
    return map;
};

var findCountOfBestCoordinate = (data) => {
    let maxCount = 0;
    for (let entry of data.entries()) {
        if (entry[1].associatePoints.length > maxCount) {
            maxCount = entry[1].associatePoints.length;
        }
    }
    return maxCount;
}

let maxX = getMaxX(data);
let maxY = getMaxY(data);
let coordinatesWithAssociatePoints = buildMapWithAssociatedPoints(data, maxX, maxY);
let filteredCoordinates = filterInfinites(data, coordinatesWithAssociatePoints, maxX, maxY);

console.log(findCountOfBestCoordinate(filteredCoordinates));