/**
 * @preserve Copyright 2019-2020 Onno Invernizzi.
 * This source code is subject to terms and conditions.
 * See LICENSE.MD.
 */

/**
 * Module:          Types
 * Responsibility:  Types for debugging state actions
 */

import Constants from "./DebuggingConstants";
import DebuggingState from "./DebuggingState";

export interface SetDebuggingState {
    type: typeof Constants.setDebuggingState;
    state: DebuggingState;
}

export type DebuggingTypes = SetDebuggingState;