
/**
 * @preserve Copyright 2010-2019 Onno Invernizzi.
 * This source code is subject to terms and conditions.
 * See LICENSE.MD.
 */

/**
 * Module:          Bird enemy
 * Responsibility:  Define animation frames for the bird enemy.
 */
import CGAColors from "../../Constants/CGAColors";
import Asset from "../../Models/Asset";

const BirdAsset: Asset = {
    frames: [
        [
            ["0", "0", "0", "0", "0", "0", "0"],
            ["0", "0", "V", "0", "V", "0", "0"],
            ["0", "V", "0", "V", "0", "V", "0"],
            ["0", "V", "0", "0", "0", "V", "0"],
        ],
        [
            ["0", "0", "0", "0", "0", "0", "0"],
            ["0", "V", "V", "0", "V", "V", "0"],
            ["V", "0", "0", "V", "0", "0", "V"],
            ["0", "0", "0", "0", "0", "0", "0"],
        ],
        [
            ["0", "0", "0", "0", "0", "0", "0"],
            ["V", "V", "V", "0", "V", "V", "V"],
            ["0", "0", "0", "V", "0", "0", "0"],
            ["0", "0", "0", "0", "0", "0", "0"],
        ],
        [
            ["V", "0", "0", "0", "0", "0", "V"],
            ["0", "V", "V", "0", "V", "V", "0"],
            ["0", "0", "0", "V", "0", "0", "0"],
            ["0", "0", "0", "0", "0", "0", "0"],
        ]
    ],
    colors: [CGAColors.lightMagenta, CGAColors.yellow, CGAColors.lightCyan, CGAColors.lightRed],
    startingAngles: [2, 358, 178, 182],
    speed: 5,
    animationFrequency: 200,
    changeColor: true,
    changeColorFrequency: 200,
    randomStartFrame: true,
    randomAngle: true,
};

export default BirdAsset;
