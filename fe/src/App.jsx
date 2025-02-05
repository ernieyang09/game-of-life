import useWebSocket from "react-use-websocket";
import Board from "./components/Board";
import { useMemo } from "react";
import Pattern from "./components/Pattern";

import patterns from "./patterns.json";

function App() {
  const { sendMessage, lastMessage } = useWebSocket(
    import.meta.env.VITE_WS_URL,
    {
      shouldReconnect: () => true, // Auto-reconnect on disconnect
    }
  );

  // refactor
  const board = useMemo(() => {
    const cleanBoard = [...Array(50)].map(() =>
      [...Array(50)].map(() => undefined)
    );
    if (lastMessage) {
      try {
        const payload = JSON.parse(lastMessage?.data);
        payload.forEach(([x, y, color]) => {
          cleanBoard[x][y] = color;
        });
      } catch (e) {
        // console.error(e);
      }
    }
    return cleanBoard;
  }, [lastMessage]);

  const onCoordClick = (coords) => {
    sendMessage(
      JSON.stringify({
        action: "update",
        payload: coords,
      })
    );
  };

  const clean = () => {
    sendMessage(JSON.stringify({ action: "clean" }));
  };

  return (
    <div>
      <Board board={board} onCoordClick={onCoordClick} />
      <button onClick={clean}>clean</button>
      <div>
        <div>Pattern</div>
        <div className="pattern-wrap">
          {patterns.map((pattern, index) => (
            <Pattern key={index} {...pattern} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
