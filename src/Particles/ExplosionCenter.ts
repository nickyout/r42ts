/**
 * @preserve Copyright 2019-2020 Onno Invernizzi.
 * This source code is subject to terms and conditions.
 * See LICENSE.MD.
 */

import BaseGameObject from "../Base/BaseGameObject";
import Explosion from "../Models/Explosion";
import GameLocation from "../Models/GameLocation";
import renderFrame from "../Render/RenderFrame";
import Frames from "../Types/Frames";
import GameObjectType from "../Types/GameObject";
import { cloneObject } from "../Utility/Lib";

/**
 * Module:          Explosion Center
 * Responsibility:  Render an explosion center.
 */

export default class ExplosionCenter extends BaseGameObject {

    /**
     * First tick passed to the draw method.
     */
    private startTick: number | undefined;

    /**
     * Explosion center frame.
     */
    private frame: string[][];

    /**
     * Time until the explosion center fizzeles out.
     */
    private fizzleTime: number;

    /**
     * Set to true when the fizzle time has passed.
     */
    private fizzled = false;

    constructor(frame: string[][], location: GameLocation, fizzleTime: number) {
        super();

        this.frame = cloneObject(frame);
        this.location = {...location};
        this.fizzleTime = fizzleTime;
    }

    public draw(tick: number): void {
        if (this.startTick === undefined) {
            this.startTick = tick;
        }

        if (tick > this.startTick + this.fizzleTime) {
            this.fizzled = true;
        }

        renderFrame(this.location, this.frame);
    }
    public getExplosion(): Explosion {
        return undefined;
    }
    public getObjectType(): GameObjectType {
        return "explosion";
    }

    public fizzledOut(): boolean {
        return this.fizzled;
    }
}