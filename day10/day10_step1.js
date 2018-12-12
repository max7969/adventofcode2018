const fs = require('fs');

let data = JSON.parse(fs.readFileSync('./data.json'));

var extractPoints = (data) => {
    let regexp = /position\=\<[\ ]*([\-0-9]*)\,\ [\ ]*([\-0-9]*)\>\ velocity\=\<[\ ]*([\-0-9]*)\,[\ ]*([\-0-9]*)\>/;
    let points = [];
    data.forEach(element => {
        let point = element.match(regexp);
        points.push({ "x": parseInt(point[1]), "y": parseInt(point[2]), "vx": parseInt(point[3]), "vy": parseInt(point[4]) });
    });
    return points;
}

var movePoints = (points) => {
    points.forEach(point => {
        point.x = point.x + point.vx;
        point.y = point.y + point.vy;
    });
    return points;
}

var getSize = (points) => {
    let minX = points.reduce((minX, point) => point.x < minX ? point.x : minX, 400000000);
    let minY = points.reduce((minY, point) => point.y < minY ? point.y : minY, 400000000);
    let maxX = points.reduce((maxX, point) => point.x > maxX ? point.x : maxX, -400000000);
    let maxY = points.reduce((maxY, point) => point.y > maxY ? point.y : maxY, -400000000);
    return { "maxX": maxX, "maxY": maxY, "minX": minX, "minY": minY };
}

var diffHeight = (imageA, imageB) => {
    let sizeA = getSize(imageA);
    let sizeB = getSize(imageB);
    return Math.abs(sizeA.maxY) - Math.abs(sizeA.minY) < Math.abs(sizeB.maxY) - Math.abs(sizeB.minY);
}

var containsPoint = (point, image) => {
    let points = image.filter((element) => element.x === point.x && element.y === point.y);
    return points.length >= 1;
}

var printImage = (image) => {
    let size = getSize(image);

    for (let i = size.minY; i <= size.maxY; i++) {
        let line = "";
        for (let j = size.minX; j <= size.maxX; j++) {
            if (containsPoint({ "x": j, "y": i }, image)) {
                line = line.concat("X");
            } else {
                line = line.concat(" ");
            }
        }
        console.log(line);
    }
}

var movePointsUntilEnd = (points) => {
    let imageFound = false;
    let image = points;
    let lastImage = null;
    while (!imageFound) {
        lastImage = JSON.parse(JSON.stringify(image));
        image = movePoints(image);
        imageFound = diffHeight(lastImage, image);
    }
    printImage(lastImage);
}

let points = extractPoints(data);
movePointsUntilEnd(points);