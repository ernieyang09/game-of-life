const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });

const rows = 32;
const cols = 32;
let grid = generateRandomGrid(rows, cols);

function generateRandomGrid(rows, cols) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => (Math.random() > 0.7 ? 1 : 0))
  );
}

// Function to calculate the next generation
function nextGeneration(grid) {
  const newGrid = grid.map((arr) => [...arr]);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const aliveNeighbors = countNeighbors(grid, r, c);
      if (grid[r][c]) {
        newGrid[r][c] = aliveNeighbors === 2 || aliveNeighbors === 3 ? 1 : 0;
      } else {
        newGrid[r][c] = aliveNeighbors === 3 ? 1 : 0;
      }
    }
  }
  return newGrid;
}

// Count the number of living neighbors
function countNeighbors(grid, row, col) {
  let count = 0;
  const directions = [-1, 0, 1];
  for (let dr of directions) {
    for (let dc of directions) {
      if (dr === 0 && dc === 0) continue;
      const r = row + dr,
        c = col + dc;
      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        count += grid[r][c];
      }
    }
  }
  return count;
}

// Broadcast updated grid to all connected clients
function broadcastGrid() {
  const message = JSON.stringify(grid);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// WebSocket connection logic
wss.on("connection", (ws) => {
  console.log("Client connected");

  // Send the initial grid to the client
  ws.send(JSON.stringify(grid));

  // Start the Game of Life loop
  const interval = setInterval(() => {
    grid = nextGeneration(grid);
    broadcastGrid(); // Send updated grid to all clients
  }, 1000); // Update every second

  // Clean up connection
  ws.on("close", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

console.log("WebSocket server is running on ws://localhost:8080");
