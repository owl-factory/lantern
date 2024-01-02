import { createContext } from "react";
import { StateController } from "../utils/stateController";

const defaultState = new StateController();

/** Context containing state for the Dynamic Render */
export const StateContext = createContext<StateController>(defaultState);
