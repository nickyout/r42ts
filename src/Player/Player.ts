/**
 * @preserve Copyright 2010-2019 Onno Invernizzi.
 * This source code is subject to terms and conditions.
 * See LICENSE.MD.
 */

/**
 * Module:          Player
 * Responsibility:  Player ship
 */

import { PlayerFrames } from "../Frames/PlayerFrames";
import KeyboardState from "../Handlers/KeyboardStateHandler/KeyboardStateHandler";
import TickHandler from "../Handlers/TickHandler";
import IDraw from "../Interfaces/IDraw";
import GameLocation from "../Models/GameLocation";
import DimensionProvider from "../Providers/DimensionProvider";
import renderFrame from "../Render/RenderFrame";
import Frames from "../Types/Frames";
import { cloneObject, getAngle, getNewLocation, setFramesColors } from "../Utility/Lib";

export default class Player implements IDraw {

    /**
     * Handles player movement.
     */
    private moveTickHandler: TickHandler;

    /**
     * Current player location.
     */
    private location: GameLocation;

    /**
     * Frames used by the player ship
     */
    private frames: Frames;

    /**
     * Construct the class.
     */
    constructor() {

        this.location = {
            left: DimensionProvider().fullWidth / 2,
            top: DimensionProvider().fullHeight * 0.9,
        };

        this.frames = cloneObject(PlayerFrames);

        setFramesColors(this.frames);
    }

    /**
     * Called when a tick occurs.
     * @param {number} tick. Tick count.
     */
    public draw(_: number): void {
        const { left, top } = this.location;

        const angle = getAngle(KeyboardState);

        if (angle !== -1) {
            this.location = getNewLocation(angle, 15, left, top);
        }

        renderFrame(this.location, this.frames.F0);
    }
}