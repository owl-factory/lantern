import { createContext } from "react";
import { StateController } from "../utils/stateController";

const defaultState = new StateController();

/** Context containing a State Controller for the Dynamic Render */
export const StateContext = createContext<StateController>(defaultState);
