/**
 * @preserve Copyright 2019-2020 Onno Invernizzi.
 * This source code is subject to terms and conditions.
 * See LICENSE.MD.
 */

import { GameLocation } from "../../Models/GameLocation";
import dimensionProvider from "../../Providers/DimensionProvider";
import { getFrameDimensions } from "../../Utility/Frame";
import getOrbFrames from "./OrbFrames";

/**
 * Module:          RobotSpawnLocations
 * Responsibility:  Returns the robot spawn locations.
 */

const {
    pixelSize,
    gameField
} = dimensionProvider();

const orbSpawnLocations: GameLocation[] = [];
const { width } = getFrameDimensions(getOrbFrames().frames[0], pixelSize);

const top = gameField.top + pixelSize * 26;
const left = pixelSize * 8;
const spacing = pixelSize * 2;

for (let i = 0; i < 22; i++) {
    const actualSpacing = i === 0 ? 0 : spacing * i;
    const actualLeft = left + i * width + spacing;

    const value = {
        left: actualLeft + actualSpacing,
        top,
    };

    orbSpawnLocations.push(value);
}

export default orbSpawnLocations;