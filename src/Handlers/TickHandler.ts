/**
 * @preserve Copyright 2010-2020 Onno Invernizzi.
 * This source code is subject to terms and conditions.
 * See LICENSE.MD.
 */

/**
 * Module:          TickHandler
 * Responsibility:  Handles a game tick.
 */

export default class TickHandler {

    /**
     * Keeps track of the last time the tick handler ticked.
     */
    private lastTick = 0;

    /**
     * Time between ticks when we have to do something.
     */
    private time: number;

    /**
     * The function called when the time between ticks has passed.
     */
    private onTimePassed: (tick: number) => void;

    /**
     * Creates the TickHandler class.
     * @param {number} time. The time that should pass between ticks.
     * @param {() => void} onTickPassed. The function to call when the specified time has passed between ticks.
     */
    constructor(time: number, onTimePassed: (tick: number) => void) {
        this.time = time;
        this.onTimePassed = onTimePassed;
    }

    /**
     * Tick
     * @param {number} tick. The current tick.
     */
    public tick(tick: number): void {
        if (tick - this.lastTick >= this.time) {
            this.onTimePassed(tick);

            this.lastTick = tick;
        }
    }
}