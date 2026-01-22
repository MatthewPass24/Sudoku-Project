package com.matthewpass.sudoku.solver;

import org.springframework.stereotype.Service;

import com.matthewpass.sudoku.board.SudokuBoard;
import com.matthewpass.sudoku.validator.SudokuValidator;

public class SudokuSolver {

    public int[][] solve(int[][] board) {
        int[][] copy = deepCopy(board);
        solveRecursive(copy);
        return copy;
    }

    /* =========================
       BACKTRACKING SOLVER
       ========================= */
    private boolean solveRecursive(int[][] board) {
        for (int row = 0; row < 9; row++) {
            for (int col = 0; col < 9; col++) {
                if (board[row][col] == 0) {
                    for (int num = 1; num <= 9; num++) {
                        if (isValid(board, row, col, num)) {
                            board[row][col] = num;

                            if (solveRecursive(board)) {
                                return true;
                            }

                            board[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    private boolean isValid(int[][] board, int row, int col, int num) {
        for (int i = 0; i < 9; i++) {
            if (board[row][i] == num) return false;
            if (board[i][col] == num) return false;
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

    private int[][] deepCopy(int[][] board) {
        int[][] copy = new int[9][9];
        for (int i = 0; i < 9; i++) {
            copy[i] = board[i].clone();
        }
        return copy;
    }
}