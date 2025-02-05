import { useAtomValue } from "jotai";
import { useEffect, useRef } from "react";
import { cursorAtom } from "../atom/patternAtom";

const CELL_SIZE = 10; // Each cell is 10x10 pixels
const GRID_LINE_WIDTH = 1; // Thickness of grid lines
const GRID_COLOR = "#000"; // Grid line color

const Board = ({ board, onCoordClick }) => {
  const canvasRef = useRef(null);
  const shift = useAtomValue(cursorAtom);

  const drawGrid = (ctx, grid) => {
    const rows = grid.length;
    const cols = grid[0]?.length || 0;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw cells
    grid.forEach((row, r) => {
      row.forEach((cell, c) => {
        ctx.fillStyle = cell ? cell : "white"; // Alive = black, Dead = white
        ctx.fillRect(
          c * CELL_SIZE + GRID_LINE_WIDTH,
          r * CELL_SIZE + GRID_LINE_WIDTH,
          CELL_SIZE - GRID_LINE_WIDTH,
          CELL_SIZE - GRID_LINE_WIDTH
        );
      });
    });

    // Draw grid lines
    ctx.strokeStyle = GRID_COLOR;
    ctx.lineWidth = GRID_LINE_WIDTH;
    ctx.beginPath();

    for (let r = 0; r <= rows; r++) {
      ctx.moveTo(0, r * CELL_SIZE + GRID_LINE_WIDTH / 2);
      ctx.lineTo(cols * CELL_SIZE, r * CELL_SIZE + GRID_LINE_WIDTH / 2);
    }

    for (let c = 0; c <= cols; c++) {
      ctx.moveTo(c * CELL_SIZE + GRID_LINE_WIDTH / 2, 0);
      ctx.lineTo(c * CELL_SIZE + GRID_LINE_WIDTH / 2, rows * CELL_SIZE);
    }

    ctx.stroke();
  };

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false; // Prevent blurry lines
    drawGrid(ctx, board);
  }, [board]);

  const handleClick = (event) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const row = Math.floor((event.clientX - rect.left) / CELL_SIZE);
    const col = Math.floor((event.clientY - rect.top) / CELL_SIZE);

    const data = shift
      .map((coords) => [col + coords[0], row + coords[1]])
      .map((coord) =>
        coord[0] < 0 || coord[1] < 0 || coord[0] >= 50 || coord[1] >= 50
          ? false
          : coord
      )
      .filter(Boolean);

    onCoordClick(data);
  };

  return (
    <canvas
      ref={canvasRef}
      width={board[0].length * CELL_SIZE + GRID_LINE_WIDTH}
      height={board.length * CELL_SIZE + GRID_LINE_WIDTH}
      style={{
        imageRendering: "pixelated", // Helps in some browsers for sharpness
      }}
      onClick={handleClick}
    />
  );
};

export default Board;
