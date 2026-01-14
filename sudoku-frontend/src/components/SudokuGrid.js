export default function SudokuGrid({
  board,
  initialBoard,
  onChange,
  invalidCells,
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(9, 40px)" }}>
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
              style={{
                width: 38,
                height: 38,
                textAlign: "center",
                fontSize: 18,
                fontWeight: locked ? "bold" : "normal",
                backgroundColor: locked
                  ? "#e0e0e0"
                  : invalid
                  ? "#ffcccc"
                  : "white",
                border: "1px solid black",
              }}
            />
          );
        })
      )}
    </div>
  );
}
