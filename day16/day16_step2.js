const fs = require('fs');

let data = JSON.parse(fs.readFileSync('./data.json'));
let program = JSON.parse(fs.readFileSync('./program.json'));

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

var sortOperations = (operations, data) => {
    let sortedOps = [];
    for (let operation of operations) {
        let countMatchingSample = 0;
        data.forEach(sample => {
            outOp = operation(JSON.parse(JSON.stringify(sample.before)), sample.exec);
            if (outOp.join('') !== sample.after.join('')) {
                countMatchingSample++;
            }
        });
        sortedOps.push({ "operation": operation, "count": countMatchingSample });
    }
    sortedOps.sort((a, b) => a.count - b.count);
    return sortedOps.map(sortedOp => sortedOp.operation);
}

var assignNumberToOperations = (data) => {
    let operations = sortOperations([addr, addi, mulr, muli, banr, bani, borr, bori, setr, seti, gtir, gtri, gtrr, eqir, eqri, eqrr], data);
    let operationsMap = new Map();
    for (let i = 0; i < 16; i++) {
        let samples = data.filter(sample => sample.exec.startsWith(i + " "));
        operations.forEach((operation, index) => {
            let matchAllSamples = true;
            samples.forEach(sample => {
                outOp = operation(JSON.parse(JSON.stringify(sample.before)), sample.exec);
                if (outOp.join('') !== sample.after.join('')) {
                    matchAllSamples = false;
                }
            })
            if (matchAllSamples) {
                if (operationsMap.get(i)) {
                    operationsMap.get(i).push(operation);
                } else {
                    operationsMap.set(i, [operation]);
                }
            }
        });
    }
    return operationsMap;
}

var cleanMap = (operationsMap) => {
    let cleanMap = new Map();
    while (Array.from(cleanMap.values()).length < 16) {
        for (let operation of operationsMap) {
            if (operationsMap.get(operation[0]).length === 1) {
                cleanMap.set(operation[0], operationsMap.get(operation[0])[0]);
                operationsMap.delete(operation[0]);
            }
        }
        for (let operation of operationsMap) {
            for (let opClean of cleanMap) {
                if (operationsMap.get(operation[0]).indexOf(cleanMap.get(opClean[0])) >= 0) {
                    operationsMap.get(operation[0]).splice(operationsMap.get(operation[0]).indexOf(cleanMap.get(opClean[0])), 1);
                }
            }
        }
    }
    return cleanMap;
}

var applyProgram = (program, data) => {
    let operationsMap = cleanMap(assignNumberToOperations(data));
    let value = [0, 0, 0, 0];
    program.forEach(instruction => {
        let operation = operationsMap.get(parseInt(instruction.split(' ')[0]));
        value = operation(value, instruction);
    });
    return value;
}

console.log(applyProgram(program, data));