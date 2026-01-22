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

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sudoku")
@CrossOrigin(origins = "*")
public class SudokuController {

    private final SudokuGenerator generator = new SudokuGenerator();
    private final SudokuSolver solver = new SudokuSolver();

    /* =========================
       NEW PUZZLE
       ========================= */
    @GetMapping("/new")
    public Map<String, int[][]> newPuzzle(
            @RequestParam(defaultValue = "medium") String difficulty
    ) {
        int[][] board = generator.generate(difficulty);
        return Map.of("board", board);
    }

    /* =========================
       SOLVE PUZZLE
       ========================= */
    @PostMapping("/solve")
    public Map<String, int[][]> solve(@RequestBody int[][] board) {
        int[][] solution = solver.solve(board);
        return Map.of("solution", solution);
    }
}