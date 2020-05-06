/**
 * @preserve Copyright 2019-2020 Onno Invernizzi.
 * This source code is subject to terms and conditions.
 * See LICENSE.MD.
 */

import { GameLocation } from "../../Models/GameLocation";
import { ParticleState } from "../Player/ParticleState";
import { EnemyState } from "./EnemyState";
import { ExplosionCenterState } from "./ExplosionCenterState";
import { ExplosionData } from "./ExplosionData";

/**
 * Module:          EnemyLevelState
 * Responsibility:  Holds the entire state of the game.
 */

export default interface EnemyLevelState {
    /**
     * Enemy bullets.
     */
    bullets: ParticleState[];

    /**
     * Shrapnell particles.
     */
    shrapnell: ParticleState[];

    /**
     * Counts the number of register enemies.
     */
    totalNumberOfEnemies: number;

    /**
     * Phaser locations.
     */
    phaserLocations: GameLocation[];

    /**
     * Fire interval
     */
    fireInterval: number;

    /**
     * Current state of explosions.
     */
    explosionCenters: ExplosionCenterState[];

    /**
     * Holds 'data' for explosions. The frame, width, height, etc. This piece
     * of state is used to render the explosion center state.
     */
    explosionData: ExplosionData | undefined;

    /**
     * The number of enemies that remain.
     */
    remainingEnemies: number;

    /**
     * State of the current enemies.
     */
    enemyState: EnemyState[];
}
