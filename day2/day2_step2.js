const fs = require('fs');

let data = JSON.parse(fs.readFileSync('./data.json'));

var matchingKey = () => {
    for (let i = 0; i < 26; i++) {
        let newKeys = data.keys.map((key) => {
            let splitKey = key.split('');
            splitKey.splice(i, 1);
            return splitKey.join('');
        });
        let nonUniques = newKeys.filter((newKey, index) => newKeys.indexOf(newKey) !== index);
        if (nonUniques.length === 1) {
            return nonUniques[0];
        }
    }
    return 'Not found';
}

console.log(matchingKey());