/**
 * @preserve Copyright 2010-2020 Onno Invernizzi.
 * This source code is subject to terms and conditions.
 * See LICENSE.MD.
 */

/**
 * Module:          Runs the game
 * Responsibility:  Main game loop.
 */

import { BaseEnemyObject } from "../Base/BaseEnemyObject";
import BaseGameObject from "../Base/BaseGameObject";
import { DrawGameField } from "../GameScreen/StaticRenders";
import KeyboardState from "../Handlers/KeyboardStateHandler/KeyboardStateHandler";
import Explosion from "../Models/Explosion";
import GameLocation from "../Models/GameLocation";
import { Level, Lives, Phasers, ScoreBoard } from "../Modules";
import ExplosionCenter from "../Particles/ExplosionCenter";
import Particle from "../Particles/Particle";
import { drawPhasor } from "../Player/DrawPhaser";
import Player from "../Player/Player";
import PlayerBullet from "../Player/PlayerBullet";
import PlayerBulletFrame from "../Player/PlayerBulletFrame";
import CtxProvider from "../Providers/CtxProvider";
import DimensionProvider from "../Providers/DimensionProvider";
import particleProvider from "../Providers/ParticleProvider";
import { getRandomArrayElement } from "../Utility/Array";
import { overlaps } from "../Utility/Geometry";
import { RunnerState } from "./RunnerState";

const fps = 1000 / 60;

// Initialise the base runner state.
// This object is the Single Source Of truth for the runner.
const state: RunnerState = {
    // Array for all enemy objects.
    enemies: [],

    // Handle used to terminate the animatio request.
    gameLoopHandle: 0,

    // Last tick that was rendered.
    lastTick: 0,

    // Reference to the player object. Used to render player actions and update player state.
    // When undefined the player is dead.
    player: undefined,

    // Reference to the player bullet object.
    // When undefined there's no bullet traveling on the screen.
    playerBullet: undefined,

    // Flag if the game is paused or not.
    pause: false,

    // Array of explosion centers currently on the screen.
    explosionCenters: [],

    // Array of particles moving on the screen.
    particles: [],

    // Flag to track if the phaser is currently on the screen.
    // Used to prevent double phaser shots because KeyDown will re-trigger
    // a phaser shot.
    phaserOnScreen: false,

    // Handle for a setTimeOut.
    drawHandle: undefined,

    // Options for debugging.
    debugging: {
        // Draws hitboxes around all game objects.
        drawHitboxes: false,

        // Disables hit detection for the player.
        playerIsImmortal: false,

        // Draws the phaser. Picks the first enemy in the enemies array.
        renderPhaser: false,
    }
};

/**
 * Start the runner.
 */
export function start(): void {
    state.gameLoopHandle = window.requestAnimationFrame(run);
}

/**
 * Stop the runner.
 */
export function stop(): void {
    window.cancelAnimationFrame(state.gameLoopHandle);
}

/**
 * Runs the main game loop.
 * @param {number} tick. The current tick.
 */
function run(tick: number): void {
    // Always update the state before drawing on the canvas. This means
    // the player is seeing the latest version of the game's state
    // and it will feel much more accurate. It also
    // means the game will not render objects that are about to be removed from the game's state.
    // For example, explosions and particles that moved out of the game's playing field.
    updateState(tick);

    // Drawing is async. Don't draw when there's a draw is process. Keep calculating the state
    if (state.drawHandle === undefined) {

        // use a setTimeOut 0 to push drawing the game to the back of the
        // callback queue. This means updating the game state
        // gets prority over rendering the game.
        state.drawHandle = window.setTimeout(() => {
            // Draw everything.
            draw(tick);

            // Draw is done, set the state's draw handle to undefined to trigger
            // a new draw.
            state.drawHandle = undefined;
        }, 0);
    }

    // Queue the next state update and render.
    state.gameLoopHandle = window.requestAnimationFrame(run);
}

/**
 * Called every request animation frame.
 * @param {number} tick. Pass the tick count because some objects update their state depending on passed ticks.
 */
function updateState(tick: number) {

    // First update the runner's own state by removing particles that can be removed.
    state.particles = state.particles.filter((p) => p.traveling());

    // Remove explosion centers that have spend their alloted time on screen.
    state.explosionCenters = state.explosionCenters.filter((ec) => ec.fizzledOut());

    // Immediately update the player state because if the player is destroyed the
    // player object will be undefined.
    state.player?.updateState();

    // Trigger self destruct sequence.
    if (KeyboardState.selfDestruct && playerIsAlive(state.player)) {
        for (const enemy of state.enemies) {
            queueRenderExplosion(enemy.getCenterLocation(), enemy.getExplosion());
        }

        queueRenderExplosion(state.player.getLocation(), state.player.getExplosion());

        state.enemies = [];
        state.player = undefined;

    }

    // Hit a random enemy with a phasor.
    if (KeyboardState.phraser && state.enemies.length > 0 && Phasers.getPhaserCount() > 0 && state.phaserOnScreen === false && playerIsAlive(state.player)) {
        handlePhaser(state.player, (destroyedEnemy) => {
            queueRenderExplosion(destroyedEnemy.getLocation(), destroyedEnemy.getExplosion());
            state.enemies = state.enemies.filter((e) => e !== destroyedEnemy);
            ScoreBoard.addToScore(destroyedEnemy.getPoints());
        });
    }

    if (state.playerBullet === undefined) {
        if (KeyboardState.fire && playerIsAlive(state.player)) {
            state.playerBullet = new PlayerBullet(PlayerBulletFrame.F0, 270, 50, 1, state.player.getNozzleLocation());
        }
    } else {
        state.playerBullet.updateState();
    }

    state.enemies.forEach((e) => e.updateState(tick));
    state.particles.forEach((e) => e.updateState());

    // Bullet left the field. Set to undefined.
    if (state.playerBullet && !state.playerBullet.traveling()) {
        state.playerBullet = undefined;
    }

    const hittableObjects = getHittableObjects();

    // There's stuff that can get hit or hit something.
    if (hittableObjects.length > 0) {
        for (const hittableObject of hittableObjects) {

            const hittableObjectHitbox = hittableObject.getHitbox();

            // Check if the player got hit.
            if (playerIsAlive(state.player) && state.debugging.playerIsImmortal === false) {
                if (overlaps(state.player.getHitbox(), hittableObjectHitbox)) {
                    queueRenderExplosion(state.player.getLocation(), state.player.getExplosion());
                    state.player = undefined;
                    Lives.removeLife();
                }
            }

            // Check if the player hit something.
            if (state.playerBullet && isEnemy(hittableObject)) {
                if (overlaps(state.playerBullet.getHitbox(), hittableObjectHitbox)) {
                    state.playerBullet = undefined;
                    queueRenderExplosion(hittableObject.getLocation(), hittableObject.getExplosion());
                    ScoreBoard.addToScore(hittableObject.getPoints());
                    state.enemies = state.enemies.filter((e) => e !== hittableObject);
                }
            }
        }
    }
}

/**
 * Called every request animation frame. Draws objects.
 * @param {number} tick. Tick.
 */
function draw(tick: number): void {
    if (state.pause) {
        return;
    }

    if (tick - state.lastTick > fps) {

        DrawGameField();
        Level.draw();
        Lives.draw();
        ScoreBoard.draw();
        Phasers.draw();

        state.player?.draw(tick);
        state.enemies.forEach((go) => go.draw(tick));
        state.particles.forEach((p) => p.draw(tick));
        state.explosionCenters.forEach((ec) => ec.draw(tick));

        state.playerBullet?.draw(tick);

        if (state.debugging.renderPhaser && playerIsAlive(state.player) && state.enemies.length > 0) {
            const enemy = state.enemies[0];
            drawPhasor(state.player.getNozzleLocation(), enemy.getCenterLocation(), DimensionProvider().averagePixelSize);
        }

        // Debugging. Show the hitboxes on screen.
        renderHitboxes();

        state.lastTick = tick;
    }
}

function renderHitboxes() {
    if (state.debugging.drawHitboxes) {
        const hittableObjects = [
            ...getHittableObjects(),
        ];
        // Add player if defined.
        if (state.player) {
            hittableObjects.push(state.player);
        }
        // Add bullet if defined.
        if (state.playerBullet) {
            hittableObjects.push(state.playerBullet);
        }
        // Draw a circle around each object using the
        // coordiates and radius of the hitbox.
        for (const hittableObject of hittableObjects) {
            const hitbox = hittableObject.getHitbox();
            const ctx = CtxProvider();
            ctx.beginPath();
            ctx.strokeStyle = "white";
            ctx.rect(hitbox.left, hitbox.top, hitbox.right - hitbox.left, hitbox.bottom - hitbox.top);
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.closePath();
        }
    }
}

/**
 * playerIsAlive.
 * @param {Player | undefined}. A player object.
 * @returns {boolean}. Returns true if the player is alove.
 */
function playerIsAlive(value: Player | undefined): value is Player {
    return value !== undefined;
}

/**
 * Handles the firing of a phasor charge.
 */
function handlePhaser(alivePlayer: Player, callback: (destroyedEnemy: BaseEnemyObject) => void): void {
    // In order to fire a phaser there must be enemies, the player must have a phaser charge, a phaser cannot
    // currently being fired (=on screen) and the player must be alive.

    // Prevent accidental double phasors when the player holds the button to long.
    state.phaserOnScreen = true;

    const randomEnemy = getRandomArrayElement(state.enemies);
    const playerNozzleLocation = alivePlayer.getNozzleLocation();
    const randomEnemyCenter = randomEnemy.getCenterLocation();

    // Remove one phaser.
    Phasers.reduceByOneCharge();
    drawPhasor(playerNozzleLocation, randomEnemyCenter, DimensionProvider().maxPixelSize);

    // Pause the game for a very brief period. This is what the original game did
    // when you fired a phasor shot.
    state.pause = true;
    window.setTimeout(() => {
        // Unpause the game to let rendering continue.
        state.pause = false;
        state.phaserOnScreen = false;

        // Deal the with the enemy that got hit.
        callback(randomEnemy);
    }, 100);
}

/**
 * Returns all gameobject that can kill the player with their hitboxes.
 * @returns {BaseGameObject[]}. An array of objects that can be hit by the player or hit the player.
 */
function getHittableObjects(): BaseGameObject[] {
    return [
        ...state.enemies,
        ...state.particles,
        ...state.explosionCenters
    ].filter((o) => o !== undefined);
}

/**
 * queue's an explosion center and the explosion particles.
 * @param {Explosion} explosion. An explosion asset.
 * @param {GameLocation} location. The center location where the explosion occurs.
 */
function queueRenderExplosion(location: GameLocation, explosion: Explosion): void {
    const center = new ExplosionCenter(explosion.explosionCenterFrame, location, explosion.explosionCenterDelay);
    const newParticles = particleProvider(location, explosion);
    state.particles.push(...newParticles);
    state.explosionCenters.push(center);
}

/**
 * Register a game object.
 * @param {BaseGameObject} gameobject.
 */
export function register(gameobject: BaseGameObject): void {
    if (isEnemy(gameobject)) {
        state.enemies.push(gameobject);
    } else if (isPlayer(gameobject)) {
        state.player = gameobject;
    } else if (isParticle(gameobject)) {
        state.particles.push(gameobject);
    }
}

/**
 * Updates the speed for all enemies.
 * @param {number} value.
 */
export function setEnemySpeed(value: number): void {
    state.enemies.forEach((e) => e.setSpeed(value));
}

/**
 * DEBUGGING ONLY: Toggles drawing hitboxes around the enemy, player and player bullet.
 */
export function toggleHitboxes(): void {
    state.debugging.drawHitboxes = !state.debugging.drawHitboxes;
}

/**
 * DEBUGGING ONLY: Toggles player immortality.
 */
export function togglePlayerImmortality(): void {
    state.debugging.playerIsImmortal = !state.debugging.playerIsImmortal;
}

/**
 * Toggles rendering the phaser.
 */
export function toggleRenderPhaser(): void {
    state.debugging.renderPhaser = !state.debugging.renderPhaser;
}

/**
 * TypeGuard for enemies
 */
function isEnemy(value: BaseGameObject): value is BaseEnemyObject {
    return value && value.getObjectType() === "enemy";
}

/**
 * TypeGuard for the player
 */
function isPlayer(value: BaseGameObject): value is Player {
    return value && value.getObjectType() === "player";
}

/**
 * TypeGuard for particles.
 */
function isParticle(value: BaseGameObject): value is Particle {
    return value && value.getObjectType() === "particle";
}