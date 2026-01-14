package com.matthewpass.sudoku.solver;

import org.springframework.stereotype.Service;

import com.matthewpass.sudoku.board.SudokuBoard;
import com.matthewpass.sudoku.validator.SudokuValidator;

@Service
public class SudokuSolver {

    public boolean solve(SudokuBoard board) {
        return solveBoard(board.getBoard());
    }

    // --- internal recursive solver ---
    private boolean solveBoard(int[][] board) {
        for (int row = 0; row < 9; row++) {
            for (int col = 0; col < 9; col++) {

                if (board[row][col] == 0) {
                    for (int num = 1; num <= 9; num++) {

                        if (SudokuValidator.isValid(board, row, col, num)) {
                            board[row][col] = num;

                            if (solveBoard(board)) return true;

                            board[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }
}
