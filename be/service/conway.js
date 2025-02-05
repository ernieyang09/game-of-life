const rows = 50;
const cols = 50;

class ConWay {
  constructor() {
    this.board = [...Array(rows)].map(() =>
      [...Array(cols)].map(() => undefined)
    );
    this.lives = {};
  }

  reset() {
    this.board = [...Array(rows)].map(() =>
      [...Array(cols)].map(() => undefined)
    );
    this.lives = {};
  }

  updateBoard(coordniates, color) {
    coordniates.forEach(([x, y]) => {
      this.board[x][y] = color;
      this.lives[`${x},${y}`] = color;
    });
  }

  nextGeneration() {
    const newBoard = [...Array(rows)].map(() =>
      [...Array(cols)].map(() => undefined)
    );
    const newLives = {};
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const aliveNeighbors = this.countNeighbors(r, c);
        if (this.board[r][c] !== undefined) {
          newBoard[r][c] =
            aliveNeighbors === 2 || aliveNeighbors === 3
              ? this.board[r][c]
              : undefined;
        } else {
          newBoard[r][c] = aliveNeighbors === 3 ? "#000" : undefined;
        }
        if (newBoard[r][c] !== undefined) {
          newLives[`${r},${c}`] = newBoard[r][c];
        }
      }
    }
    this.board = newBoard;
    this.lives = newLives;
  }

  countNeighbors(row, col) {
    let count = 0;
    const directions = [-1, 0, 1];

    for (let dr of directions) {
      for (let dc of directions) {
        if (dr === 0 && dc === 0) continue; // Skip the current cell
        const r = row + dr;
        const c = col + dc;

        // Check within valid bounds
        if (r >= 0 && r < rows && c >= 0 && c < cols) {
          count += this.board[r][c] ? 1 : 0; // Count only alive cells
        }
      }
    }

    return count;
  }
}

module.exports = { ConWay };
