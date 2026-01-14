package com.matthewpass.sudoku.generator;

import java.util.Random;

import org.springframework.stereotype.Service;

import com.matthewpass.sudoku.board.SudokuBoard;
import com.matthewpass.sudoku.model.Difficulty;
import com.matthewpass.sudoku.validator.SudokuValidator;

@Service
public class SudokuGenerator {

    // PUBLIC method used by the controller
    public SudokuBoard generate(Difficulty difficulty) {
        int[][] board = generateFullBoard();
        removeNumbers(board, difficulty.getClues());
        return new SudokuBoard(board);
    }

    // --- internal helpers (can stay non-public) ---

    private int[][] generateFullBoard() {
        int[][] board = new int[9][9];
        fillBoard(board);
        return board;
    }

    private void removeNumbers(int[][] board, int clues) {
        Random rand = new Random();
        int cellsToRemove = 81 - clues;

        while (cellsToRemove > 0) {
            int row = rand.nextInt(9);
            int col = rand.nextInt(9);

            if (board[row][col] != 0) {
                board[row][col] = 0;
                cellsToRemove--;
            }
        }
    }

    private boolean fillBoard(int[][] board) {
        for (int row = 0; row < 9; row++) {
            for (int col = 0; col < 9; col++) {

                if (board[row][col] == 0) {

                    int[] nums = {1,2,3,4,5,6,7,8,9};
                    shuffle(nums);

                    for (int num : nums) {
                        if (SudokuValidator.isValid(board, row, col, num)) {

                            board[row][col] = num;

                            if (fillBoard(board)) return true;

                            board[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    private void shuffle(int[] nums) {
        Random rand = new Random();
        for (int i = nums.length - 1; i > 0; i--) {
            int j = rand.nextInt(i + 1);
            int temp = nums[i];
            nums[i] = nums[j];
            nums[j] = temp;
        }
    }
}
