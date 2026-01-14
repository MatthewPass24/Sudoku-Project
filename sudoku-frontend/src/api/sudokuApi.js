const BASE_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:8080/api/sudoku";

export async function fetchNewPuzzle(difficulty) {
  const response = await fetch(
    `${BASE_URL}/new?difficulty=${difficulty}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch puzzle");
  }

  return response.json();
}

export async function solvePuzzle(board) {
  const response = await fetch(`${BASE_URL}/solve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(board),
  });

  if (!response.ok) {
    throw new Error("Failed to solve puzzle");
  }

  return response.json();
}
