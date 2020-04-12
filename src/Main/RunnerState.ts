/**
 * @preserve Copyright 2019-2020 Onno Invernizzi.
 * This source code is subject to terms and conditions.
 * See LICENSE.MD.
 */

import { BaseEnemyObject } from "../Base/BaseEnemyObject";
import ExplosionCenter from "../Particles/ExplosionCenter";
import Particle from "../Particles/Particle";
import Player from "../Player/Player";
import PlayerBullet from "../Player/PlayerBullet";

/**
 * Module:          RunnerState
 * Responsibility:  State of the runner
 */

export interface RunnerState {
    /**
     * Event handler for enemy destruction
     */
    onEnemyDestruction: () => void;

    /**
     * Array of current game objects on screen.
     */

    enemies: BaseEnemyObject[];

    /**
     * Animation frame handler.
     */
    gameLoopHandle: number;

    /**
     * Keeps track of the last tick when the animation was fired.
     * Used to determine when to call the next frame.
     */
    lastTick: number;

    /**
     * Reference to the player object.
     */
    player: Player | undefined;

    /**
     * Quick reference to the player bullet.
     */
    playerBullet: PlayerBullet | undefined;

    /**
     * Particles travelling on the screen.
     */
    particles: Particle[];

    /**
     * Explosion centers on the screen.
     */
    explosionCenters: ExplosionCenter[];

    /**
     * Flag to track if the phaser is beam is currently being fired.
     */
    phaserOnScreen: boolean;

    /**
     * Pause flag
     */
    pause: boolean;

    /**
     * Draw handle
     */
    drawHandle: number | undefined;

    /**
     * Debugging options.
     */
    debugging: {
        drawHitboxes: boolean;
        playerIsImmortal: boolean;
        renderPhaser: boolean;
    };
}