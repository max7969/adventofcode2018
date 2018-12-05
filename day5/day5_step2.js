const fs = require('fs');

let data = JSON.parse(fs.readFileSync('./data.json'));
let alphabet = JSON.parse(fs.readFileSync('./alphabet.json'));

var removeReaction = (key) => {
    let inputKey = JSON.parse(JSON.stringify(key));;
    for(let i=0; i < key.length; i++) {
        if ((key[i].toUpperCase() === key[i+1] && key[i] === key[i+1].toLowerCase()) 
        || (key[i].toLowerCase() === key[i+1] && key[i] === key[i+1].toUpperCase())) {
            key.splice(i, 2);
        }
    }
    if (inputKey.length === key.length) {
        return key;
    } else {
        return removeReaction(key);
    }
}

var getBestPolymerSize = (key) => {
    let bestSize = key.length;
    alphabet.forEach(type => {
        let keyFiltered = JSON.parse(JSON.stringify(key)).filter((letter) => letter.toLowerCase() !== type);
        let size = removeReaction(keyFiltered).length;
        if (bestSize > size) {
            bestSize = size;
        }
    });
    return bestSize;
}

console.log(getBestPolymerSize(data.key.split('')));