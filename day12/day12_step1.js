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

var evolve = (state, notes, times) => {
    for (let i = 0; i < times; i++) {
        state = generateNextGen(state, notes);
    }
    return state;
}

var printState = (state) => {
    console.log(state.join(''));
}

var computeSumPlants = (state, initialState) => {
    let index = -initialState.length;
    let sum = 0;
    for (let i = 0; i < state.length; i++) {
        if (state[i] === "#") {
            sum += index;
        }
        index++;
    }
    return sum;
}

let state = initState(data.initialState);
let notes = initNotes(data.notes);

state = evolve(state, notes, 20);
printState(state);
console.log(computeSumPlants(state, data.initialState));