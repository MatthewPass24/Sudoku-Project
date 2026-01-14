package com.matthewpass.sudoku.model;

public enum Difficulty {
    EASY(40),
    MEDIUM(30),
    HARD(25);

    private final int clues;

    Difficulty(int clues) {
        this.clues = clues;
    }

    public int getClues() {
        return clues;
    }
}
