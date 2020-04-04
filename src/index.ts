/**
 * @preserve Copyright 2010-2020 Onno Invernizzi.
 * This source code is subject to terms and conditions.
 * See LICENSE.MD.
 */

/**
 * Module:          Index
 * Responsibility:  Entry point for the game
 */

import BirdEnemy from "./Enemies/Bird/Bird";
import { registerListeners } from "./Handlers/KeyboardStateHandler/KeyboardStateHandler";
import { Level, Lives, Phasers, ScoreBoard } from "./Modules";
import Player from "./Player/Player";
import DimensionProvider from "./Providers/DimensionProvider";
import * as Runner from "./Runner";

window.onload = () => {

    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    if (canvas) {
        // Initialize the dimentions of the canvas.
        canvas.width = DimensionProvider().fullWidth;
        canvas.height = DimensionProvider().fullHeight;

        switch (window.location.search.replace("?", "")) {
            case "playground": {

                registerListeners();
                const player = new Player();

                for (let i = 0; i < 20; i ++) {
                    const bird = new BirdEnemy();
                    Runner.register(bird);
                }

                Runner.registerPlayer(player);

                // player starts with two lives by default.
                Lives.setLives(2);

                (window as any).r42 = {
                    updateScore: (n: number) => ScoreBoard.updateScore(n),
                    addToScore: (n: number) => ScoreBoard.addToScore(n),
                    setLives: (n: number) => Lives.setLives(n),
                    addLife: () => Lives.addLife(),
                    setLevel: (n: number) => Level.setLevel(n),
                    addLevel: () => Level.addLevel(),
                    addPhaser: () => Phasers.addPhaser(),
                    setPhasers: (n: number) => Phasers.setPhasers(n),
                    removePhaser: () => Phasers.removePhaser(),
                };

                Runner.start();

                break;
            }

            default:
            // StartGame();
        }
    }
};