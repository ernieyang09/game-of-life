const WebSocket = require("ws");
const { ConWay } = require("./service/conway");
const wss = new WebSocket.Server({ port: 8080 });
const { randomColor } = require("./lib/colors");

const game = new ConWay();

const formatLives = () => {
  const arr = [];
  for (const [key, value] of Object.entries(game.lives)) {
    const [x, y] = key.split(",");
    arr.push([x, y, value]);
  }
  return arr;
};

function broadcastGrid() {
  const message = JSON.stringify(formatLives());
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// WebSocket connection logic
wss.on("connection", (ws) => {
  // Let's assume 2 clients won't collide on the same color
  const color = randomColor();

  let interval;
  console.log("Client connected");

  // Send the initial grid to the client
  console.log(JSON.stringify(formatLives()));
  ws.send(
    JSON.stringify({
      color,
    })
  );
  ws.send(JSON.stringify(formatLives()));

  // Start the Game of Life loop
  interval = setInterval(() => {
    game.nextGeneration();
    broadcastGrid(); // Send updated grid to all clients
  }, 5000); // Update every second

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);

      if (data.action === "clean") {
        game.reset();
        broadcastGrid();
      }

      if (data.action === "update") {
        game.updateBoard(data.payload, color);
        broadcastGrid();
      }
    } catch (e) {
      console.error(e);
    }
  });

  // Clean up connection
  ws.on("close", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

console.log("WebSocket server is running on ws://localhost:8080");
