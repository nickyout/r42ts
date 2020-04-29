/**
 * @preserve Copyright 2019-2020 Onno Invernizzi.
 * This source code is subject to terms and conditions.
 * See LICENSE.MD.
 */

import { angles } from "../Constants/Angles";
import Accelerating from "../LocationProviders/Accelerating";
import PlayerBullet from "../Player/PlayerBullet";
import getTwoPixelBullet from "../SharedFrames/twoPXBullet";
import { setBullet } from "../State/Player/Actions";
import { appState, dispatch } from "../State/Store";
import GameLoop from "./GameLoop";

/**
 * Module:          PlayerRunner
 * Responsibility:  Module dedicated to managing player state.
 */

export default function playerRunner(): void {
    updateState();
    GameLoop.registerDraw(draw);
}

/**
 * Updates the player state.
 */
function updateState(): void {
    const {
        gameState
    } = appState();

    if (gameState.pause) {
        return;
    }

    const { playerState, keyboardState } = appState();
    playerState.ship?.updateState();
    playerState.playerBullet?.updateState();

    // Remove objects no longer required.
    if (playerState.playerBullet?.traveling() === false) {
        dispatch(setBullet(undefined));
    }

    // Fire new bullet.
    if (playerState.ship !== undefined && keyboardState.fire && playerState.playerBullet === undefined) {
        const nozzleLocation = playerState.ship.getNozzleLocation();

        const locationProvider = new Accelerating(nozzleLocation.left, nozzleLocation.top, 42, angles.up, 1);
        dispatch(setBullet(new PlayerBullet(locationProvider, getTwoPixelBullet)));
    }

    // Self destruct and firing a phaser are handled in the EnemeyLevelRunner. That's the only time either can be used.
}

/**
 * Draw the player and player bullet.
 */
function draw(): void {
    const { playerState } = appState();
    playerState.ship?.draw();
    playerState.playerBullet?.draw();
}