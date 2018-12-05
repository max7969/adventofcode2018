const fs = require('fs');

let data = JSON.parse(fs.readFileSync('./data.json'));

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

console.log(removeReaction(data.key.split('')).length);