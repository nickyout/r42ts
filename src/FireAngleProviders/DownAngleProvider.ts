/**
 * @preserve Copyright 2019-2020 Onno Invernizzi.
 * This source code is subject to terms and conditions.
 * See LICENSE.MD.
 */

import { angles } from "../Constants/Angles";
import { EnemyState } from "../State/EnemyLevel/EnemyState";

/**
 * Module:          DownAngleProvider
 * Responsibility:  Always returns 'down' as the angle
 */

/**
 * Returns down.
 * @param {BaseEnemy} enemy. Any enemy.
 */
export default function downFireAngleProvider(enemy: EnemyState, top: number, left: number): number {
    return angles.down;
}
