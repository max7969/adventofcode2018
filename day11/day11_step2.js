let serialNumber = 1723;

var computeFuelCell = (x, y, serialNumber) => {
    let rackId = x + 10;
    let fuel = (rackId * y + serialNumber) * rackId;
    return Math.floor((fuel / 100) % 10) - 5;
}

var createGrid = (serialNumber) => {
    let grid = new Array(300);
    for (let i = 0; i < 300; i++) {
        grid[i] = new Array(300);
        for (let j = 0; j < 300; j++) {
            grid[i][j] = computeFuelCell(i + 1, j + 1, serialNumber);
        }
    }
    return grid;
}

var sumFuelSquare = (x, y, size, grid) => {
    let sum = 0;
    for (let i = x; i < x + size; i++) {
        for (let j = y; j < y + size; j++) {
            sum += grid[i][j];
        }
    }
    return sum;
}

var findBestSquare = (grid) => {
    let best = { "x": 0, "y": 0, "size": 0 };
    let bestSum = 0;

    for (let size = 1; size < 300; size++) {
        for (let i = 0; i < 300 - size; i++) {
            for (let j = 0; j < 300 - size; j++) {
                let sum = sumFuelSquare(i, j, size, grid);
                if (sum > bestSum) {
                    bestSum = sum;
                    best.x = i + 1;
                    best.y = j + 1;
                    best.size = size;
                }
            }
        }
    }
    return best;
}

let grid = createGrid(serialNumber);
console.log(findBestSquare(grid));