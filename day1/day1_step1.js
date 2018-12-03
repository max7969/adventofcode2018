const fs = require('fs');

let rawdata = fs.readFileSync('./data.json');  
let data = JSON.parse(rawdata);

console.log(data.frequencies.reduce((a, b) => a + b, 0));