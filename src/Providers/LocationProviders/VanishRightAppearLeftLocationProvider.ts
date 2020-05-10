/**
 * @preserve Copyright 2019-2020 Onno Invernizzi.
 * This source code is subject to terms and conditions.
 * See LICENSE.MD.
 */

import BaseLocationProvider from "../../Base/BaseLocationProvider";
import ILocationProvider from "../../Interfaces/ILocationProvider";
import { getLocation } from "../../Utility/Location";
import dimensionProvider from "../DimensionProvider";

/**
 * Module:          Left to right, then left.
 * Responsibility:  Location provider for enemies that move from left to right and up then down.
 */

const {
    gameField
} = dimensionProvider();

export default class VanishRightAppearLeftLocationProvider extends BaseLocationProvider implements ILocationProvider {
    private maxTop: number;
    private maxBottom: number;

    /**
     *
     */
    constructor(left: number, top: number, speed: number, angle: number, width: number, height: number, maxTop: number, maxBottom: number) {
        super(left, top, speed, angle, width, height);

        this.maxTop = maxTop,
        this.maxBottom = maxBottom;
    }

    public updateState(tick: number): void {
        super.updateState(tick);

        if (this.left + this.width > gameField.right) {
            this.left = 0;
        }

        if (this.top > this.maxBottom) {
            this.top = this.maxTop;
        }

        const { left, top } = getLocation(this.left, this.top, this.angle, this.speed);
        this.left = left;
        this.top = top;
    }
}