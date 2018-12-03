const fs = require('fs');

let data = JSON.parse(fs.readFileSync('./data.json'));
let alphabet = JSON.parse(fs.readFileSync('./alphabet.json'));

var containsLetterTuple = (key, tupleSize) => {
    for (let letter of alphabet) {
        if (key.length - key.split(letter).join('').length === tupleSize) {
            return true;
        }
    }
    return false;
}

let countDouble = data.keys.reduce((count, key) => (containsLetterTuple(key, 2) ? count + 1 : count), 0);
let countTriple = data.keys.reduce((count, key) => (containsLetterTuple(key, 3) ? count + 1 : count), 0);

console.log(countDouble);
console.log(countTriple);
console.log(countDouble * countTriple);


