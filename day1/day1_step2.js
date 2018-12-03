const fs = require('fs');

let rawdata = fs.readFileSync('./data.json');  
let data = JSON.parse(rawdata);

var frequency = 0;
var reachedFrequencies = [0];
var alreadyReachedFrequency;

while (!alreadyReachedFrequency) {
    data.frequencies.forEach(element => {
        frequency += element;
        if (reachedFrequencies.includes(frequency) && !alreadyReachedFrequency) {
            alreadyReachedFrequency = frequency;
        }
        reachedFrequencies.push(frequency);
    });
}
console.log(alreadyReachedFrequency);