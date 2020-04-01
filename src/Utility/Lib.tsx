/**
 * @preserve Copyright 2010-2020 Onno Invernizzi.
 * This source code is subject to terms and conditions.
 * See LICENSE.MD.
 */

/**
 * Module:          Lib
 * Responsibility:  A library containing various helper functions
 */

import KeyboardState from "../Handlers/KeyboardStateHandler/KeyboardState";
import GameLocation from "../Models/GameLocation";
import DimensionProvider from "../Providers/DimensionProvider";
import { Frames } from "../Types/Types";

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
 * @param {number} left. The current left coordinate of the object.
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
 * Creates a clone for the provides Frames.
 * @param {Frames} frames. Frames to clone.
 * @returns {Frames}. A clone of the provided frames.
 */
export function cloneObject<T>(obj: T): T {
    // Create a clone using JSON.
    return JSON.parse(JSON.stringify(obj)) as T;
}

/**
 * Returns the dimensions of a frame in PX.
 * @param {string[][]} frame. A frame.
 * @returns {width, height}.
 */
export function getFrameDimensions(frame: string[][]): { width: number; height: number } {
    return {
        width: frame[0].length * DimensionProvider().maxPixelSize,
        height: frame.length * DimensionProvider().maxPixelSize,
    };
}

/**
 * pads a string on its left size until it is a given length
 * @param {string} value. Value to pad left.
 * @param {number} length. Length of the desired output.
 * @param {string} paddWidth. Character to pad width.
 */
export function padLeft(value: string, length: number, padWidth: string): string {

    if (value.length >= length) {
        return value;
    } else {

        const padLength = length - value.length;
        let padding = "";

        for (let i = 0; i < padLength; i++) {
            padding += padWidth;
        }

        return padding + value;
    }
}

/**
 * Picks a random number within a range.
 * @param {number} max. Maximum value.
 * @param {number} min. Minimum value.
 */
export function randomNumberInRange(max: number, min: number): number {
    return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Calculates a GameLocation object where the center of a frame resides.
 * @param {number} location.
 * @param {frame} frame.
 */
export function getFrameCenter(location: GameLocation, frame: string[][]): GameLocation {
    const dimensions = getFrameDimensions(frame);

    return {
        left: location.left + dimensions.width / 2,
        top: location.top + dimensions.height / 2,
    };
}

/**
 * Calculates a game location for every colored pixel in a frame.
 * @param {string[][]} frame. A frame.
 * @param {GameLocation }location. Top left location coordinates.
 */
export function getFrameLocations(frame: string[][], location: GameLocation): GameLocation[] {
    const returnValue: GameLocation[] = [];

    const {
        maxPixelSize
    } = DimensionProvider();

    frame.forEach((row, rowIndex) => row.forEach((col, colIndex) => {
        if (col !== "0") {
            const pixelLocation: GameLocation = {
                left: colIndex * maxPixelSize + location.left,
                top: rowIndex * maxPixelSize + location.top,
            };

            returnValue.push(pixelLocation);
        }
    }));

    return returnValue;
}