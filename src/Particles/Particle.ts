/**
 * @preserve Copyright 2019-2020 Onno Invernizzi.
 * This source code is subject to terms and conditions.
 * See LICENSE.MD.
 */

import BaseParticle from "../Base/BaseParticle";
import ILocationProvider from "../Base/ILocationProvider";
import { GameRectangle } from "../Models/GameRectangle";
import { GameSize } from "../Models/GameSize";
import dimensionProvider from "../Providers/DimensionProvider";
import { FrameProviderFunction } from "../Types/Types";
import { getFrameDimensions, getFrameHitbox } from "../Utility/Frame";
import { fallsWithin } from "../Utility/Location";

/**
 * Module:          Particle
 * Responsibility:  Render a single particle.
 */

const {
    averagePixelSize
} = dimensionProvider();

const topOffset = averagePixelSize / 2 * -1;
const bottomOffset = averagePixelSize / 2;

export default class Particle extends BaseParticle {

    /**
     * Dimensions of the particle.
     */
    private dimensions: GameSize;

    /**
     * Construct the object.
     * @param {number} left. Left coordinate.
     * @param {number} top. Top coordinate.
     * @param {FrameProviderFunction} getFrame. Frame for the particle.
     * @param {number} angle. Angle the particle will travel.
     * @param {number} speed. Speed at which the particle will travel.
     * @param {number} acceleration. Acceleration applies each update of the state.
     */
    constructor(locationProvider: ILocationProvider, getFrame: FrameProviderFunction) {
        super(locationProvider);

        this.currentFrame = getFrame();
        this.dimensions = getFrameDimensions(this.currentFrame, averagePixelSize);
    }

    /**
     * Returns true if the particle is traveling.
     * @returns {boolean}. True if the particle is in the game field.
     */
    public traveling(): boolean {
        const {
            gameFieldTop,
            fullWidth,
            fullHeight,
        } = dimensionProvider();

        return fallsWithin(this.left, this.top, gameFieldTop, fullHeight, 0, fullWidth);
    }

    /**
     * Returns the particles hitbox.
     * @returns {GameRectangle}. The hitbox.
     */
    public getHitbox(): GameRectangle {
        return getFrameHitbox(this.left, this.top, this.dimensions.width, this.dimensions.height, topOffset, bottomOffset);
    }
}
