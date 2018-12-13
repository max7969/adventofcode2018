const fs = require('fs');

let data = JSON.parse(fs.readFileSync('./data.json'));

var extractConfiguration = (data) => {
    let wagons = [];
    let rails = [];
    data.forEach((line, y) => {
        let chars = line.split('');
        rails.push(chars);
        chars.forEach((char, x) => {
            if (char === "v") {
                wagons.push({ "x": x, "y": y, "vx": 0, "vy": 1, "change": 0 });
                rails[y][x] = "|";
            } else if (char === "^") {
                wagons.push({ "x": x, "y": y, "vx": 0, "vy": -1, "change": 0 });
                rails[y][x] = "|";
            } else if (char === ">") {
                wagons.push({ "x": x, "y": y, "vx": 1, "vy": 0, "change": 0 });
                rails[y][x] = "-";
            } else if (char === "<") {
                wagons.push({ "x": x, "y": y, "vx": -1, "vy": 0, "change": 0 });
                rails[y][x] = "-";
            }
        });
    });
    return { "wagons": wagons, "rails": rails };
}

var sortWagons = (wagons) => {
    wagons.sort((a, b) => (a.y * 10 + a.x) - (b.y * 10 + b.x));
}

var moveWagon = (wagon, rails) => {
    let rail = rails[wagon.y][wagon.x];
    if (rail === "-") {
        wagon.x += wagon.vx;
    } else if (rail === "|") {
        wagon.y += wagon.vy;
    } else if (rail === "/" && wagon.vx === 0 && wagon.vy === 1) {
        wagon.vx = -1; wagon.vy = 0; wagon.x += wagon.vx;
    } else if (rail === "/" && wagon.vx === 0 && wagon.vy === -1) {
        wagon.vx = 1; wagon.vy = 0; wagon.x += wagon.vx;
    } else if (rail === "/" && wagon.vy === 0 && wagon.vx === 1) {
        wagon.vy = -1; wagon.vx = 0; wagon.y += wagon.vy;
    } else if (rail === "/" && wagon.vy === 0 && wagon.vx === -1) {
        wagon.vy = 1; wagon.vx = 0; wagon.y += wagon.vy;
    } else if (rail === "\\" && wagon.vx === 0 && wagon.vy === 1) {
        wagon.vx = 1; wagon.vy = 0; wagon.x += wagon.vx;
    } else if (rail === "\\" && wagon.vx === 0 && wagon.vy === -1) {
        wagon.vx = -1; wagon.vy = 0; wagon.x += wagon.vx;
    } else if (rail === "\\" && wagon.vy === 0 && wagon.vx === 1) {
        wagon.vy = 1; wagon.vx = 0; wagon.y += wagon.vy;
    } else if (rail === "\\" && wagon.vy === 0 && wagon.vx === -1) {
        wagon.vy = -1; wagon.vx = 0; wagon.y += wagon.vy;
    } else if (rail === "+") {
        updatePosOnCross(wagon);
    }
}

var updatePosOnCross = (wagon) => {
    if (wagon.change % 3 === 0 && wagon.vx === 0) {
        wagon.vx = wagon.vy; wagon.vy = 0; wagon.x += wagon.vx;
    } else if (wagon.change % 3 === 0 && wagon.vy === 0) {
        wagon.vy = -wagon.vx; wagon.vx = 0; wagon.y += wagon.vy;
    } else if (wagon.change % 3 === 1) {
        wagon.x += wagon.vx; wagon.y += wagon.vy;
    } else if (wagon.change % 3 === 2 && wagon.vx === 0) {
        wagon.vx = -wagon.vy; wagon.vy = 0; wagon.x += wagon.vx;
    } else if (wagon.change % 3 === 2 && wagon.vy === 0) {
        wagon.vy = wagon.vx; wagon.vx = 0; wagon.y += wagon.vy;
    }
    wagon.change++;
}

var getWagonsCrashed = (wagons) => {
    let wagonsCrashed = [];
    wagons.forEach(wagon => {
        if (wagons.filter(current => current.x === wagon.x && current.y === wagon.y).length === 2) {
            wagonsCrashed.push(wagon);
        }
    });
    return wagonsCrashed;
}

var moveWagonsUntilOneLeft = (rails, wagons) => {
    while (wagons.length > 1) {
        sortWagons(wagons);
        wagons.forEach(wagon => {
            moveWagon(wagon, rails);
            getWagonsCrashed(wagons).forEach(wagonToRemove => {
                wagons = wagons.filter(current => (wagonToRemove.x !== current.x || wagonToRemove.y !== current.y));
            });
        });
    }
    return wagons[0];
}

let configuration = extractConfiguration(data);
console.log(moveWagonsUntilOneLeft(configuration.rails, configuration.wagons));