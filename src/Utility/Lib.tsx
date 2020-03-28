/**
 * @preserve Copyright 2010-2020 Onno Invernizzi.
 * This source code is subject to terms and conditions.
 * See LICENSE.MD.
 */

/**
 * Module:          Lib
 * Responsibility:  A library containing various helper functions
 */

import GameLocation from "../Models/GameLocation";
import ObjectLocation from "../Models/ObjectLocation";
import DimensionProvider from "../Providers/DimensionProvider";
import KeyboardState from "../Providers/KeyboardStateProvider/KeyboardState";
import Frames from "../Types/Frames";

/**
 * Gets the next X coordinats based on the angle, speed and the current X coordinate.
 * @param {number} angle. The angle.
 * @param {number} speed. The speed.
 * @param {number} current. The current X coordinate.
 * @returns {number}. The next X coordinate.
 */
export function getNextX(angle: number, speed: number, current: number): number {
    return Math.cos(angle * Math.PI / 180) * speed + current;
}

/**
 * Gets the next Y coordinate based on the angle, speed and the current Y coordinate.
 * @param {number} angle. The angle.
 * @param {number} speed. The speed.
 * @param {number} current. The current X coordinate.
 * @returns {number}. The next Y coordinate.
 */
export function getNextY(angle: number, speed: number, current: number): number {
    return Math.sin(angle * (Math.PI / 180)) * speed + current;
}

/**
 * getAngle.
 * @param {KeyboardState} state. Current keyboard dstate
 * @returns {number}. The angle. -1 indicated the ship is not moving.
 */
export function getAngle(state: KeyboardState): number {
    let angle = -1;
    if (state.up && state.left) {
        angle = 225;
    } else if (state.up && state.right) {
        angle = 315;
    } else if (state.down && state.left) {
        angle = 135;
    } else if (state.down && state.right) {
        angle = 45;
    } else if (state.left) {
        angle = 180;
    } else if (state.right) {
        angle = 0;
    } else if (state.up) {
        angle = 270;
    } else if (state.down) {
        angle = 90;
    }

    return angle;
}

/**
 * Calculates a new location.
 * @param {number} angle. The angle of the object.
 * @param {number} speed. The speed the of the object
 * @param {number} right. The right outer bounds where the object can travel
 * @param {number} bottom. The bottom bounds where the object can travel.
 * @param {number} left. The current left coordinate of the object.
 * @param {number} top. The current top coordinate of the object.
 * @param {number} objectWidth. The object's width in pixels.
 * @param {number} objectHeight. The object's height in pixels.
 * @returns {Location}. The new location of the object.
 */
export function getNewLocation(angle: number, speed: number, left: number, top: number): GameLocation {

    const nextLeft = getNextX(angle, speed, left);
    const nextTop = getNextY(angle, speed, top);

    return {
        left: nextLeft,
        top: nextTop,
    };
}

/**
 * Get's the dimensions of a 2d array.
 * @param {any[]}. Any array.
 * @returns {rows: number, columns: number}. The dimensions of the 2d array.
 */
export function get2dArrayDimensions(array: any[][]): { rows: number, columns: number } {
    return {
        rows: array.length,
        columns: array[0].length,
    };
}

/**
 * Returns a random element from an array
 * @param {T[]} arr. An array of type T.
 * @returns {T}. Value found in a random position.
 */
export function getRandomArrayElement<T>(arr: T[]): T {
    if (arr.length === 1) {
        return arr[0];
    } else {
        const randomIndex = Math.floor(Math.random() * arr.length);
        return arr[randomIndex];
    }
}

/**
 * Returns a number between 0 and the number of elements in the array.
 * @param {any[]} arr. An array of any type.
 * @returns {number}. A randomly selected index from the array.
 */
export function getRandomArrayIndex(arr: any[]): number {
    return Math.floor(Math.random() * arr.length - 1);
}

export function getRandomFrameKeyIndex(obj: Frames): number {
    const objectKeys = Object.keys(obj).length - 1;

    return Math.round(Math.random() * objectKeys);
}

/**
 * Update frames whose cells contain "V" to a randonly selected color.
 * @param {string[][][]} frames. A set of frames.
 * @param {string[]} colors. Array containing colors.
 */
export function setRandomFrameColors(frames: Frames, colors: string[]): void {
    Object.keys(frames).forEach((key) => {
        const color = getRandomArrayElement(colors);
        frames[key].forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                if (cell !== "0") {
                    frames[key][rowIndex][cellIndex] = color;
                }
            });
        });
    });
}

/**
 * Creates a clone for the provides Frames.
 * @param {Frames} frames. Frames to clone.
 * @returns {Frames}. A clone of the provided frames.
 */
export function cloneFrames(frames: Frames): Frames {
    const clonedFrames = {} as Frames;

    Object.keys(frames).forEach((key) => clonedFrames[key] = [...frames[key]]);

    return clonedFrames;
}

export function getFrameDimensions(frame: string[][]): { width: number; height: number}  {
    return {
        width: frame[0].length * DimensionProvider().maxPixelSize,
        height: frame.length * DimensionProvider().maxPixelSize,
    };
}