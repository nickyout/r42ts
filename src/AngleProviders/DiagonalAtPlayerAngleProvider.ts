/**
 * @preserve Copyright 2019-2020 Onno Invernizzi.
 * This source code is subject to terms and conditions.
 * See LICENSE.MD.
 */

/**
 * Module:          DiagonalAtPlayerAngleProvider
 * Responsibility:  Returns down/left or down/right aimed at the player
 */

import { BaseEnemy } from "../Base/BaseEnemy";

export function diagonalAtPlayerAngleProvider(self: BaseEnemy): number | undefined {
    return -1;
}
