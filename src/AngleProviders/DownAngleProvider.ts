/**
 * @preserve Copyright 2019-2020 Onno Invernizzi.
 * This source code is subject to terms and conditions.
 * See LICENSE.MD.
 */

/**
 * Module:          DownAngleProvider
 * Responsibility:  Always returns 'down' as the angle
 */

import { angles } from "../Constants/Angles";
import GameLocation from "../Models/GameLocation";

/**
 * Returns down.
 * @param {BaseEnemy} enemy. Any enemy.
 */
export function downAngleProvider(location: GameLocation): number {
    return angles.down;
}