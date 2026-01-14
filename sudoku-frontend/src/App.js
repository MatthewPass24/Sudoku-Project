import { useEffect, useState, useRef } from "react";
import SudokuGrid from "./components/SudokuGrid";
import { fetchNewPuzzle, solvePuzzle } from "./api/sudokuApi";

/* ---------- Sudoku validation ---------- */
function isValid(board, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (i !== col && board[row][i] === num) return false;
    if (i !== row && board[i][col] === num) return false;
  }

  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;

  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if ((r !== row || c !== col) && board[r][c] === num) {
        return false;
      }
    }
  }

  return true;
}

/* ---------- Win helpers ---------- */
function isBoardComplete(board) {
  return board.every(row => row.every(cell => cell !== 0));
}

function isBoardSolved(board) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const num = board[r][c];
      if (!isValid(board, r, c, num)) return false;
    }
  }
  return true;
}

/* ---------- localStorage ---------- */
const STORAGE_KEY = "sudoku-save";

function saveGame(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadGame() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : null;
}

function clearGame() {
  localStorage.removeItem(STORAGE_KEY);
}

export default function App() {
  const [board, setBoard] = useState([]);
  const [initialBoard, setInitialBoard] = useState([]);
  const [invalidCells, setInvalidCells] = useState(new Set());
  const [difficulty, setDifficulty] = useState("medium");
  const [time, setTime] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [score, setScore] = useState(null);

  const timerRef = useRef(null);

  /* ---------- Timer ---------- */
  function startTimer() {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTime(t => t + 1);
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerRef.current);
  }

  /* ---------- Load puzzle ---------- */
  async function loadPuzzle(diff) {
    clearGame();

    const data = await fetchNewPuzzle(diff);

    stopTimer();
    setBoard(data.board);
    setInitialBoard(data.board.map(r => [...r]));
    setInvalidCells(new Set());
    setMistakes(0);
    setGameOver(false);
    setWon(false);
    setScore(null);
    setTime(0);
    setDifficulty(diff);

    startTimer();
  }

  /* ---------- Handle input ---------- */
  function handleChange(row, col, value) {
    if (gameOver || won) return;
    if (initialBoard[row][col] !== 0) return;

    const newBoard = board.map(r => [...r]);
    const newInvalid = new Set(invalidCells);

    if (value === "") {
      newBoard[row][col] = 0;
      newInvalid.delete(`${row}-${col}`);
      setBoard(newBoard);
      setInvalidCells(newInvalid);
      return;
    }

    if (!/^[1-9]$/.test(value)) return;

    const num = parseInt(value);

    if (!isValid(newBoard, row, col, num)) {
      setMistakes(m => {
        const next = m + 1;
        if (next >= 3) {
          setGameOver(true);
          stopTimer();
        }
        return next;
      });
      newInvalid.add(`${row}-${col}`);
    } else {
      newInvalid.delete(`${row}-${col}`);
    }

    newBoard[row][col] = num;
    setBoard(newBoard);
    setInvalidCells(newInvalid);

    /* ---------- WIN CHECK ---------- */
    if (isBoardComplete(newBoard) && isBoardSolved(newBoard)) {
      stopTimer();
      setWon(true);
      setScore(calculateScore());
    }
  }

  /* ---------- Solve ---------- */
  async function solve() {
    if (gameOver || won) return;
    const result = await solvePuzzle(board);
    stopTimer();
    setBoard(result.solution);
    setScore(calculateScore());
  }

  /* ---------- Scoring ---------- */
  function calculateScore() {
    const multiplier = { easy: 1, medium: 2, hard: 3 }[difficulty];
    return Math.max(0, multiplier * (1000 - time - mistakes * 100));
  }

  /* ---------- Load saved game ---------- */
  useEffect(() => {
    const saved = loadGame();
    if (!saved) return;

    setBoard(saved.board);
    setInitialBoard(saved.initialBoard);
    setTime(saved.time);
    setMistakes(saved.mistakes);
    setDifficulty(saved.difficulty);
    setGameOver(saved.gameOver);
    setWon(saved.won);
    setScore(saved.score);

    startTimer();
  }, []);

  /* ---------- Save game ---------- */
  useEffect(() => {
    if (board.length !== 9) return;

    saveGame({
      board,
      initialBoard,
      time,
      mistakes,
      difficulty,
      gameOver,
      won,
      score
    });
  }, [board, time, mistakes, gameOver, won, score, difficulty]);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Sudoku</h1>

      <div style={{ marginBottom: 10 }}>
        <button onClick={() => loadPuzzle("easy")}>Easy</button>
        <button onClick={() => loadPuzzle("medium")}>Medium</button>
        <button onClick={() => loadPuzzle("hard")}>Hard</button>
        <button onClick={solve} disabled={gameOver || won}>
          Solve
        </button>
      </div>

      <p>⏱ Time: {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</p>
      <p>❌ Mistakes: {mistakes} / 3</p>

      {gameOver && <h2 style={{ color: "red" }}>Game Over</h2>}
      {won && <h2 style={{ color: "green" }}>🎉 You Win!</h2>}
      {score !== null && <h3>Score: {score}</h3>}

      {board.length === 9 && (
        <SudokuGrid
          board={board}
          initialBoard={initialBoard}
          onChange={handleChange}
          invalidCells={invalidCells}
        />
      )}
    </div>
  );
}
