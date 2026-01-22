import "./App.css";
import { useEffect, useRef, useState } from "react";
import SudokuGrid from "./components/SudokuGrid";
import { fetchNewPuzzle, solvePuzzle } from "./api/sudokuApi";

/* ---------- validation ---------- */
function isValid(board, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (i !== col && board[row][i] === num) return false;
    if (i !== row && board[i][col] === num) return false;
  }

  const br = Math.floor(row / 3) * 3;
  const bc = Math.floor(col / 3) * 3;

  for (let r = br; r < br + 3; r++) {
    for (let c = bc; c < bc + 3; c++) {
      if ((r !== row || c !== col) && board[r][c] === num) return false;
    }
  }
  return true;
}

const isComplete = board =>
  board.every(row => row.every(cell => cell !== 0));

export default function App() {
  const [board, setBoard] = useState([]);
  const [initialBoard, setInitialBoard] = useState([]);
  const [invalidCells, setInvalidCells] = useState(new Set());
  const [difficulty, setDifficulty] = useState("medium");
  const [time, setTime] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [won, setWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);

  const timer = useRef(null);

  function startTimer() {
    clearInterval(timer.current);
    timer.current = setInterval(() => setTime(t => t + 1), 1000);
  }

  function stopTimer() {
    clearInterval(timer.current);
  }

  function calculateScore(finalMistakes) {
    const base = { easy: 1000, medium: 2000, hard: 3000 }[difficulty];
    const penalty = { easy: 50, medium: 100, hard: 150 }[difficulty];
    return Math.max(0, base - finalMistakes * penalty);
  }

  async function loadPuzzle(diff) {
    setLoading(true);
    try {
      const data = await fetchNewPuzzle(diff);
      stopTimer();
      setBoard(data.board);
      setInitialBoard(data.board.map(r => [...r]));
      setInvalidCells(new Set());
      setMistakes(0);
      setWon(false);
      setGameOver(false);
      setScore(null);
      setTime(0);
      setDifficulty(diff);
      startTimer();
    } finally {
      setLoading(false);
    }
  }

  function handleChange(r, c, val) {
    if (won || gameOver || initialBoard[r][c] !== 0) return;

    const next = board.map(row => [...row]);
    const invalid = new Set(invalidCells);

    if (val === "") {
      next[r][c] = 0;
      invalid.delete(`${r}-${c}`);
      setBoard(next);
      setInvalidCells(invalid);
      return;
    }

    if (!/^[1-9]$/.test(val)) return;

    const num = Number(val);
    next[r][c] = num;

    if (!isValid(next, r, c, num)) {
      invalid.add(`${r}-${c}`);
      setMistakes(m => {
        const nm = m + 1;
        if (nm >= 3) {
          stopTimer();
          setGameOver(true);
        }
        return nm;
      });
    } else {
      invalid.delete(`${r}-${c}`);
    }

    setBoard(next);
    setInvalidCells(invalid);

    if (isComplete(next) && invalid.size === 0) {
      stopTimer();
      setWon(true);
      setScore(calculateScore(mistakes));
    }
  }

  async function solve() {
    if (won || gameOver) return;
    stopTimer();
    const res = await solvePuzzle(board);
    setBoard(res.solution);
  }

  useEffect(() => {
    return () => clearInterval(timer.current);
  }, []);

  return (
    <div className="app">
      <h1>Sudoku</h1>

      <div className="button-row">
        <button onClick={() => loadPuzzle("easy")}>Easy</button>
        <button onClick={() => loadPuzzle("medium")}>Medium</button>
        <button onClick={() => loadPuzzle("hard")}>Hard</button>
        <button onClick={solve} disabled={won || gameOver}>Solve</button>
      </div>

      <div className="top-bar">
        <span>⏱ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</span>
        <span>❌ {mistakes}/3</span>
      </div>

      {loading && <p className="loading">⏳ Generating puzzle…</p>}

      <div className="board-wrapper">
        {board.length === 9 && (
          <SudokuGrid
            board={board}
            initialBoard={initialBoard}
            onChange={handleChange}
            invalidCells={invalidCells}
          />
        )}
      </div>

      {gameOver && <p className="status bad">Game Over</p>}
      {won && <p className="status good">🎉 Score: {score}</p>}
    </div>
  );
}
