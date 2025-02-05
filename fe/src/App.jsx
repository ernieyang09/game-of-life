import Board from "./components/Board";

function App() {
  const board = [...Array(50)].map(() => [...Array(50)].map(() => false));
  board[0][0] = "blue";
  return (
    <div>
      <Board board={board} />
    </div>
  );
}

export default App;
