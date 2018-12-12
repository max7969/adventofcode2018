const fs = require('fs');

let data = JSON.parse(fs.readFileSync('./data.json'));

var initState = (initialState) => {
    let empty = new Array(initialState.length).fill(".");
    let state = empty.concat(initialState.split(''), empty);
    return state;
}

var initNotes = (notes) => {
    let extractedNotes = [];
    notes.forEach(note => {
        extractedNotes.push({ "combination": note[0].split(''), "res": note[1] });
    });
    return extractedNotes;
}

var generateNextGen = (state, notes) => {
    let newState = Array(state.length).fill(".");
    for (let i = 2; i < state.length - 2; i++) {
        let toApply = notes.filter(note => note.combination.join('') === state.slice(i - 2, i + 3).join(''));
        if (toApply.length === 1) {
            newState[i] = toApply[0].res;
        }
    }
    return newState;
}

var extractPattern = (state) => {
    let first = 0;
    let last = state.length - 1;
    for (let i = 0; i < state.length; i++) {
        if (state[i] === "#") {
            first = i;
            break;
        }
    }
    for (let i = state.length - 1; i >= 0; i--) {
        if (state[i] === "#") {
            last = i;
            break;
        }
    }
    return state.slice(first, last + 1);
}

var evolveUntilTheEnd = (state, notes, times) => {
    let storedStates = [JSON.parse(JSON.stringify(state))];
    for (let i = 0; i < times; i++) {
        state = generateNextGen(state, notes);
        let existingState = storedStates.filter(storedState => extractPattern(storedState).join('') === extractPattern(state).join(''));
        if (existingState.length === 1) {
            return {
                "state": JSON.parse(JSON.stringify(state)),
                "iteration": i,
                "nextState": generateNextGen(state, notes),
                "previous": storedStates.pop()
            };
        }
        storedStates.push(JSON.parse(JSON.stringify(state)));
    }
    return {
        "state": JSON.parse(JSON.stringify(state)),
        "iteration": times,
        "nextState": generateNextGen(state, notes),
        "previous": storedStates.pop()
    };
}

var diffBetweenFirstIndex = (stateA, stateB) => {
    let firstIndexA;
    let firstIndexB;
    for (let i = 0; i < stateA.length; i++) {
        if (stateA[i] === "#") {
            firstIndexA = i;
        }
        if (stateB[i] === "#") {
            firstIndexB = i;
        }
        if (firstIndexA && firstIndexB) {
            break;
        }
    }
    return firstIndexB - firstIndexA;
}

var computeSumPlants = (state, remainIterationCount, initialState, indexDiff) => {
    let index = -initialState.length;
    let sum = 0;
    for (let i = 0; i < state.length; i++) {
        if (state[i] === "#") {
            sum += index + remainIterationCount;
        }
        index += indexDiff;
    }
    return sum;
}

let state = initState(data.initialState);
let notes = initNotes(data.notes);

evolution = evolveUntilTheEnd(state, notes, 50000000000);
let indexDiff = diffBetweenFirstIndex(evolution.state, evolution.nextState);
console.log(computeSumPlants(evolution.state, 50000000000 - (evolution.iteration + 1), data.initialState, indexDiff));