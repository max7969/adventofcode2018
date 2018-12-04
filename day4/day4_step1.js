const fs = require('fs');

let data = JSON.parse(fs.readFileSync('./data.json'));

var sortData = (data) => {
    return data.map((value) => {
        let regexp = /\[([0-9\-\:\ ]*)\]([a-zA-Z0-9\ \#]*)/;
        return {
            'date': new Date(value.match(regexp)[1]),
            'action': value.match(regexp)[2]
        };
    }).sort((a, b) => a.date - b.date);
};

var extractGuardsData = (data) => {
    let guardsData = new Map();
    let currentGuardId;
    let currentMinuteAsleep = 0;
    let currentMinuteWakesUp = 0;
    data.forEach(element => {
        let guardRegexp = /\ Guard\ \#([0-9]*)\ /;
        let fallsAsleepRegexp = /\ falls\ asleep/;
        let wakesUpRegexp = /\ wakes\ up/;
        if (element.action.match(guardRegexp)) {
            currentGuardId = element.action.match(guardRegexp)[1];
        } else if (element.action.match(fallsAsleepRegexp)) {
            currentMinuteAsleep = element.date.getMinutes();
        } else if (element.action.match(wakesUpRegexp)) {
            currentMinuteWakesUp = element.date.getMinutes();
            if (!guardsData.get(currentGuardId)) {
                let minutesAsleep = new Array(60).fill(0);
                for (let i = currentMinuteAsleep; i < currentMinuteWakesUp; i++) {
                    minutesAsleep[i] = 1;
                }
                guardsData.set(currentGuardId, minutesAsleep);
            } else {
                let minutesAsleep = guardsData.get(currentGuardId);
                for (let i = currentMinuteAsleep; i < currentMinuteWakesUp; i++) {
                    minutesAsleep[i] = minutesAsleep[i] + 1;
                }
                guardsData.set(currentGuardId, minutesAsleep);
            }
        }
    });
    return guardsData;
};

var findLazyGuard = (guards) => {
    let laziest;
    for (let element of guards.entries()) {
        if (!laziest) {
            laziest = element;
        } else {
            if (laziest[1].reduce((a, b) => a + b, 0) < element[1].reduce((a, b) => a + b, 0)) {
                laziest = element;
            }
        }
    };
    return laziest;
};

let sortedData = sortData(data);
let guardsData = extractGuardsData(sortedData);
let laziest = findLazyGuard(guardsData);

console.log(laziest[0] * laziest[1].indexOf(Math.max(...laziest[1])));