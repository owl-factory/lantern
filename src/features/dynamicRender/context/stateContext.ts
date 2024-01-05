import { StateController } from "features/dynamicRender/utils/stateController";
import { createContext } from "react";

const defaultState = new StateController();

/** Context containing a State Controller for the Dynamic Render */
export const StateContext = createContext<StateController>(defaultState);
