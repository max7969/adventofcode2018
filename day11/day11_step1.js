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

var sumFuelSquare = (x, y, grid) => {
    let top = grid[x - 1][y] + grid[x - 1][y + 1] + grid[x - 1][y - 1];
    let mid = grid[x][y] + grid[x][y + 1] + grid[x][y - 1];
    let bot = grid[x + 1][y] + grid[x + 1][y + 1] + grid[x + 1][y - 1];
    return top + bot + mid;
}

var findBestSquare = (grid) => {
    let best = { "x": 0, "y": 0 };
    let bestSum = 0;
    for (let i = 1; i < 299; i++) {
        for (let j = 1; j < 299; j++) {
            if (sumFuelSquare(i, j, grid) > bestSum) {
                bestSum = sumFuelSquare(i, j, grid);
                best.x = i;
                best.y = j;
            }
        }
    }
    return best;
}

let grid = createGrid(serialNumber);
console.log(findBestSquare(grid));