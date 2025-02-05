import useWebSocket from "react-use-websocket";
import Board from "./components/Board";
import { useEffect, useMemo } from "react";

const WS_URL = "ws://localhost:8080"; // Change to your backend WebSocket URL

function App() {
  const { sendMessage, lastMessage } = useWebSocket(WS_URL, {
    shouldReconnect: () => true, // Auto-reconnect on disconnect
  });

  const board = useMemo(() => {
    const cleanBoard = [...Array(50)].map(() =>
      [...Array(50)].map(() => undefined)
    );
    if (lastMessage) {
      try {
        console.log(lastMessage);
        const payload = JSON.parse(lastMessage?.data);
        payload.forEach(([x, y, color]) => {
          cleanBoard[x][y] = color;
        });
      } catch (e) {
        console.error(e);
      }
    }
    return cleanBoard;
  }, [lastMessage]);

  const onCoordClick = ({ x, y }) => {
    console.log(x, y);
    sendMessage(
      JSON.stringify({
        action: "update",
        payload: [[x, y, "#000"]],
      })
    );
  };

  return (
    <div>
      <Board board={board} onCoordClick={onCoordClick} />
    </div>
  );
}

export default App;
