const fs = require('fs');

let rawdata = fs.readFileSync('./data.json');  
let data = JSON.parse(rawdata);

var frequency = 0;
data.frequencies.forEach(element => {
    frequency += element;
});
console.log(frequency);