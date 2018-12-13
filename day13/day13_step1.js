const fs = require('fs');

let data = JSON.parse(fs.readFileSync('./day13/data.json'));

var extractMap = (data) => {
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

var getColisions = (wagons) => {
    let coords = wagons.map(wagon => wagon.x + "," + wagon.y);
    return coords.filter((coord, index) => coords.indexOf(coord) !== index);
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

var moveWagonsUntilCollision = (rails, wagons) => {
    let iterations = 0;
    let colisions = getColisions(wagons);
    while (colisions.length === 0) {
        sortWagons(wagons);
        wagons.forEach(wagon => {
            moveWagon(wagon, rails);
            colisions = getColisions(wagons);
            if (colisions.length === 1) {
                return colisions[0];
            }
        });
    }
    return colisions[0];
}

var print = (rails, wagons) => {
    for (let i = 0; i < rails.length; i++) {
        let str = "";
        for (let j = 0; j < rails[i].length; j++) {
            let uniqueWagon = wagons.filter(wagon => wagon.x === j && wagon.y === i);
            if (uniqueWagon.length === 1) {
                str = str.concat("W");
            } else {
                str = str.concat(rails[i][j])
            }
        }
        console.log(str);
    }
}

let map = extractMap(data);
console.log(moveWagonsUntilCollision(map.rails, map.wagons));