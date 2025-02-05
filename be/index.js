const WebSocket = require("ws");
const { ConWay } = require("./service/conway");
const wss = new WebSocket.Server({ port: 5123 });
const { randomColor } = require("./lib/colors");

const game = new ConWay();

let interval;

function resetInterval() {
  clearInterval(interval);
  interval = setInterval(() => {
    game.nextGeneration();
    broadcastGrid();
  }, 1000);
}

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

  console.log("Client connected");

  ws.send(
    JSON.stringify({
      color,
    })
  );
  ws.send(JSON.stringify(formatLives()));

  resetInterval();

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);

      if (data.action === "clean") {
        game.reset();
        resetInterval();
        broadcastGrid();
      }

      if (data.action === "update") {
        game.updateBoard(data.payload, color);
        resetInterval();
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

console.log("WebSocket server is running on ws://localhost:5123");
