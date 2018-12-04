const fs = require('fs');

let data = JSON.parse(fs.readFileSync('./data.json'));

let computed = new Map();
data.forEach(element => {
    let interestingPart = element.split('@')[1];
    let startingPos = interestingPart.split(':')[0];
    let size = interestingPart.split(':')[1];
    let startingX = parseInt(startingPos.split(',')[0]);
    let startingY = parseInt(startingPos.split(',')[1]);
    let stepX = parseInt(size.split('x')[0]);
    let stepY = parseInt(size.split('x')[1]);

    for (let i = startingX; i < (startingX + stepX); i++) {
        for (let j = startingY; j < (startingY + stepY); j++) {
            computed.set(i + '-' + j, computed.get(i + '-' + j) ? computed.get(i + '-' + j) + 1 : 1);
        }
    }
});

let count = 0;
for (let value of computed.values()) {
    if (value > 1) {
        count = count + 1;
    }
}

console.log(count);