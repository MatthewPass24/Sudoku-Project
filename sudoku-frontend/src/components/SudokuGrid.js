export default function SudokuGrid({ board, initialBoard, onChange, invalidCells }) {
  return (
    <div className="sudoku-grid">
      {board.map((row, r) =>
        row.map((cell, c) => {
          const locked = initialBoard[r][c] !== 0;
          const invalid = invalidCells.has(`${r}-${c}`);

          return (
            <input
              key={`${r}-${c}`}
              value={cell === 0 ? "" : cell}
              disabled={locked}
              onChange={(e) => onChange(r, c, e.target.value)}
              className={`cell ${locked ? "locked" : ""} ${invalid ? "invalid" : ""}`}
            />
          );
        })
      )}
    </div>
  );
}
