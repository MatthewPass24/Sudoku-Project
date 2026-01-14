package com.matthewpass.sudoku.validator;

public class SudokuValidator {

    public static boolean isValid(int[][] board, int row, int col, int num) {

        // Check row
        for (int c = 0; c < 9; c++) {
            if (board[row][c] == num) return false;
        }

        // Check column
        for (int r = 0; r < 9; r++) {
            if (board[r][col] == num) return false;
        }

        // Check 3x3 box
        int boxRowStart = (row / 3) * 3;
        int boxColStart = (col / 3) * 3;

        for (int r = boxRowStart; r < boxRowStart + 3; r++) {
            for (int c = boxColStart; c < boxColStart + 3; c++) {
                if (board[r][c] == num) return false;
            }
        }

        return true;
    }
}
