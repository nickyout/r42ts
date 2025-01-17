/**
 * @preserve Copyright 2019-2021 Onno Invernizzi.
 * This source code is subject to terms and conditions.
 * See LICENSE.MD.
 */

import React from "react";
import GameResultModel from "../Models/GameResultModel";
import { setScreenState } from "../State/Game/GameActions";
import { dispatch } from "../State/Store";
import { HoverButton } from "./Components/HoverButton";
import { Styles } from "./Styles";

/**
 * Module:          GameOver
 * Responsibility:  Game over screen
 */

export default function GameOver(props: { gameResult: GameResultModel | undefined }): JSX.Element {
    const {
        gameResult
    } = props;

    return (
        <>
            <p style={Styles.header}>Game over</p>
            <br />
            <div style={Styles.defaultContainer}>
                <table style={{ ...Styles.textStyle, width: "20%" }}>
                    <tbody>
                        <tr><td>Score</td><td>{gameResult?.score}</td></tr>
                        <tr><td>Bullets fired</td><td>{gameResult?.bulletsFired}</td></tr>
                        <tr><td>Enemies hit</td><td>{gameResult?.enemiesHit}</td></tr>
                        <tr><td>% Hit</td><td>{getHitPercentage(gameResult?.enemiesHit, gameResult?.bulletsFired)}</td></tr>
                    </tbody>
                </table>
            </div>
            <br />
            <div style={Styles.buttonContainer}>
                <HoverButton onClick={() => dispatch(setScreenState("mainmenu"))} text="Ok" />
            </div>
        </>
    );
}

/**
 * Calculates the % hit to display when the game is over.
 * @param {number | undefined} enemiesHit. Number of enememies hit.
 * @param {number | undefined} bulletsFired. Number of bullets fired
 * @returns {string}. Percentage value to show.
 */
function getHitPercentage(enemiesHit: number | undefined, bulletsFired: number | undefined): string {
    if (enemiesHit === undefined) {
        return "0%";
    }

    if (bulletsFired === undefined) {
        return "0%";
    }

    if (bulletsFired === 0) {
        return "0%";
    }

    const percentageHit = (enemiesHit / bulletsFired) * 100;

    return `${Math.round(percentageHit)}%`;
}