const fs = require('fs');

let data = JSON.parse(fs.readFileSync('./data.json'));

var readClaims = () => {
    let claims = new Map();
    data.forEach(element => {
        let id = element.split('@')[0]
        let pos = element.split('@')[1];
        let startingPos = pos.split(':')[0];
        let size = pos.split(':')[1];
        let startingX = parseInt(startingPos.split(',')[0]);
        let startingY = parseInt(startingPos.split(',')[1]);
        let stepX = parseInt(size.split('x')[0]);
        let stepY = parseInt(size.split('x')[1]);
        claims.set(id, {
            'topLeft': {
                'x': startingX,
                'y': startingY
            },
            'botRight': {
                'x': startingX + stepX,
                'y': startingY + stepY
            }
        });
    });
    return claims;
};

var isPointInArea = (x, y, area) => {
    return x >= area.topLeft.x
        && x <= area.botRight.x
        && y >= area.topLeft.y
        && y <= area.botRight.y;
};

var isIntersecte = (a, b) => {
    for (let i = a.topLeft.x; i < a.botRight.x; i++) {
        for (let j = a.topLeft.y; j < a.botRight.y; j++) {
            if (isPointInArea(i, j, b)) {
                return true;
            }
        }
    }
    return false;
}

var findGoodClaims = () => {
    let claims = readClaims();
    let goodClaims = new Set(Array.from(claims.keys()));
    claims.forEach((value, key) => {
        for (let entry of claims.entries()) {
            if (entry[0] !== key
                && isIntersecte(value, entry[1])) {
                goodClaims.delete(key);
                goodClaims.delete(entry[0]);
            }
        }
    });
    return goodClaims;
};

console.log(findGoodClaims());