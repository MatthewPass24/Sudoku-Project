package com.matthewpass.sudoku.generator;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

public class SudokuGenerator {

    private static final int SIZE = 9;
    private static final int EMPTY = 0;

    private final Random rand = new Random();

    /* =========================
       PUBLIC ENTRY POINT
       ========================= */
    public int[][] generate(String difficulty) {
        int[][] board = new int[SIZE][SIZE];

        // Step 1: generate a full valid solution
        fillBoard(board);

        // Step 2: remove numbers while keeping UNIQUE solution
        removeNumbers(board, difficulty);

        return board;
    }

    /* =========================
       FULL BOARD GENERATION
       ========================= */
    private boolean fillBoard(int[][] board) {
        for (int row = 0; row < SIZE; row++) {
            for (int col = 0; col < SIZE; col++) {
                if (board[row][col] == EMPTY) {
                    List<Integer> nums = shuffledNumbers();
                    for (int num : nums) {
                        if (isValid(board, row, col, num)) {
                            board[row][col] = num;
                            if (fillBoard(board)) return true;
                            board[row][col] = EMPTY;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    private List<Integer> shuffledNumbers() {
        List<Integer> nums = new ArrayList<>();
        for (int i = 1; i <= 9; i++) nums.add(i);
        Collections.shuffle(nums, rand);
        return nums;
    }

    /* =========================
       REMOVAL WITH UNIQUENESS
       ========================= */
    private void removeNumbers(int[][] board, String difficulty) {
        int clues = switch (difficulty) {
            case "easy" -> 40;
            case "medium" -> 32;
            case "hard" -> 26;
            default -> 32;
        };

        List<int[]> cells = new ArrayList<>();
        for (int r = 0; r < SIZE; r++) {
            for (int c = 0; c < SIZE; c++) {
                cells.add(new int[]{r, c});
            }
        }

        Collections.shuffle(cells, rand);

        int removed = 0;
        int targetRemovals = 81 - clues;

        for (int[] cell : cells) {
            if (removed >= targetRemovals) break;

            int r = cell[0];
            int c = cell[1];

            int backup = board[r][c];
            board[r][c] = EMPTY;

            // Check uniqueness
            if (countSolutions(copy(board), 2) != 1) {
                board[r][c] = backup; // revert
            } else {
                removed++;
            }
        }
    }

    /* =========================
       SOLUTION COUNTING
       ========================= */
    private int countSolutions(int[][] board, int limit) {
        return solveAndCount(board, 0, 0, limit);
    }

    private int solveAndCount(int[][] board, int row, int col, int limit) {
        if (row == SIZE) return 1;

        int nextRow = col == SIZE - 1 ? row + 1 : row;
        int nextCol = col == SIZE - 1 ? 0 : col + 1;

        if (board[row][col] != EMPTY) {
            return solveAndCount(board, nextRow, nextCol, limit);
        }

        int count = 0;
        for (int num = 1; num <= 9; num++) {
            if (isValid(board, row, col, num)) {
                board[row][col] = num;
                count += solveAndCount(board, nextRow, nextCol, limit);
                if (count >= limit) {
                    board[row][col] = EMPTY;
                    return count;
                }
                board[row][col] = EMPTY;
            }
        }
        return count;
    }

    /* =========================
       VALIDATION
       ========================= */
    private boolean isValid(int[][] board, int row, int col, int num) {
        for (int i = 0; i < SIZE; i++) {
            if (board[row][i] == num || board[i][col] == num) return false;
        }

        int br = (row / 3) * 3;
        int bc = (col / 3) * 3;

        for (int r = br; r < br + 3; r++) {
            for (int c = bc; c < bc + 3; c++) {
                if (board[r][c] == num) return false;
            }
        }
        return true;
    }

    private int[][] copy(int[][] board) {
        int[][] out = new int[SIZE][SIZE];
        for (int i = 0; i < SIZE; i++) {
            out[i] = board[i].clone();
        }
        return out;
    }
}