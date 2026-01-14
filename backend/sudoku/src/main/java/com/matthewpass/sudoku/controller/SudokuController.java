package com.matthewpass.sudoku.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.matthewpass.sudoku.board.SudokuBoard;
import com.matthewpass.sudoku.generator.SudokuGenerator;
import com.matthewpass.sudoku.model.Difficulty;
import com.matthewpass.sudoku.solver.SudokuSolver;

@RestController
@RequestMapping("/api/sudoku")
@CrossOrigin(origins = "*")
public class SudokuController {

    private final SudokuGenerator generator;
    private final SudokuSolver solver;

    public SudokuController(SudokuGenerator generator, SudokuSolver solver) {
        this.generator = generator;
        this.solver = solver;
    }

    @GetMapping("/new")
    public Map<String, int[][]> newPuzzle(
            @RequestParam(required = false) String difficulty) {

        if (difficulty == null) difficulty = "medium";

        Difficulty diff = switch (difficulty.toLowerCase()) {
            case "easy" -> Difficulty.EASY;
            case "hard" -> Difficulty.HARD;
            default -> Difficulty.MEDIUM;
        };

        SudokuBoard board = generator.generate(diff);

        Map<String, int[][]> response = new HashMap<>();
        response.put("board", board.getBoard());
        return response;
    }

    @PostMapping("/solve")
    public Map<String, int[][]> solve(@RequestBody int[][] board) {

        SudokuBoard sudokuBoard = new SudokuBoard(board);
        solver.solve(sudokuBoard);

        Map<String, int[][]> response = new HashMap<>();
        response.put("solution", sudokuBoard.getBoard());
        return response;
    }
}
