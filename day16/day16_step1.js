const fs = require('fs');

let data = JSON.parse(fs.readFileSync('./data.json'));

var addr = (input, instruction) => {
    let output = input;
    let instructions = instruction.split(' ');
    let a = parseInt(instructions[1]); let b = parseInt(instructions[2]); let c = parseInt(instructions[3]);
    output[c] = input[a] + input[b];
    return output;
}

var addi = (input, instruction) => {
    let output = input;
    let instructions = instruction.split(' ');
    let a = parseInt(instructions[1]); let b = parseInt(instructions[2]); let c = parseInt(instructions[3]);
    output[c] = input[a] + b;
    return output;
}

var mulr = (input, instruction) => {
    let output = input;
    let instructions = instruction.split(' ');
    let a = parseInt(instructions[1]); let b = parseInt(instructions[2]); let c = parseInt(instructions[3]);
    output[c] = input[a] * input[b];
    return output;
}

var muli = (input, instruction) => {
    let output = input;
    let instructions = instruction.split(' ');
    let a = parseInt(instructions[1]); let b = parseInt(instructions[2]); let c = parseInt(instructions[3]);
    output[c] = input[a] * b;
    return output;
}

var banr = (input, instruction) => {
    let output = input;
    let instructions = instruction.split(' ');
    let a = parseInt(instructions[1]); let b = parseInt(instructions[2]); let c = parseInt(instructions[3]);
    output[c] = input[a] & input[b];
    return output;
}

var bani = (input, instruction) => {
    let output = input;
    let instructions = instruction.split(' ');
    let a = parseInt(instructions[1]); let b = parseInt(instructions[2]); let c = parseInt(instructions[3]);
    output[c] = input[a] & b;
    return output;
}

var borr = (input, instruction) => {
    let output = input;
    let instructions = instruction.split(' ');
    let a = parseInt(instructions[1]); let b = parseInt(instructions[2]); let c = parseInt(instructions[3]);
    output[c] = input[a] | input[b];
    return output;
}

var bori = (input, instruction) => {
    let output = input;
    let instructions = instruction.split(' ');
    let a = parseInt(instructions[1]); let b = parseInt(instructions[2]); let c = parseInt(instructions[3]);
    output[c] = input[a] | b;
    return output;
}

var setr = (input, instruction) => {
    let output = input;
    let instructions = instruction.split(' ');
    let a = parseInt(instructions[1]); let b = parseInt(instructions[2]); let c = parseInt(instructions[3]);
    output[c] = input[a];
    return output;
}

var seti = (input, instruction) => {
    let output = input;
    let instructions = instruction.split(' ');
    let a = parseInt(instructions[1]); let b = parseInt(instructions[2]); let c = parseInt(instructions[3]);
    output[c] = a;
    return output;
}

var gtir = (input, instruction) => {
    let output = input;
    let instructions = instruction.split(' ');
    let a = parseInt(instructions[1]); let b = parseInt(instructions[2]); let c = parseInt(instructions[3]);
    output[c] = a > input[b] ? 1 : 0;
    return output;
}

var gtri = (input, instruction) => {
    let output = input;
    let instructions = instruction.split(' ');
    let a = parseInt(instructions[1]); let b = parseInt(instructions[2]); let c = parseInt(instructions[3]);
    output[c] = input[a] > b ? 1 : 0;
    return output;
}

var gtrr = (input, instruction) => {
    let output = input;
    let instructions = instruction.split(' ');
    let a = parseInt(instructions[1]); let b = parseInt(instructions[2]); let c = parseInt(instructions[3]);
    output[c] = input[a] > input[b] ? 1 : 0;
    return output;
}

var eqir = (input, instruction) => {
    let output = input;
    let instructions = instruction.split(' ');
    let a = parseInt(instructions[1]); let b = parseInt(instructions[2]); let c = parseInt(instructions[3]);
    output[c] = a === input[b] ? 1 : 0;
    return output;
}

var eqri = (input, instruction) => {
    let output = input;
    let instructions = instruction.split(' ');
    let a = parseInt(instructions[1]); let b = parseInt(instructions[2]); let c = parseInt(instructions[3]);
    output[c] = input[a] === b ? 1 : 0;
    return output;
}

var eqrr = (input, instruction) => {
    let output = input;
    let instructions = instruction.split(' ');
    let a = parseInt(instructions[1]); let b = parseInt(instructions[2]); let c = parseInt(instructions[3]);
    output[c] = input[a] === input[b] ? 1 : 0;
    return output;
}

var countMatchingOperations = (input, instruction, output) => {
    let operations = [addr, addi, mulr, muli, banr, bani, borr, bori, setr, seti, gtir, gtri, gtrr, eqir, eqri, eqrr];
    let count = 0;
    operations.forEach(operation => {
        let opOutput = operation(JSON.parse(JSON.stringify(input)), instruction);
        if (opOutput.join('') === output.join('')) {
            count++;
        }
    });
    return count;
}

var countInstructionsMatchingMultipleOperations = (data) => {
    let count = 0;
    data.forEach(config => {
        let countMatchingOp = countMatchingOperations(config.before, config.exec, config.after);
        if (countMatchingOp > 2) {
            count++;
        }
    });
    return count;
}

console.log(countInstructionsMatchingMultipleOperations(data));