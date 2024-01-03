import { createContext } from "react";
import { RenderController } from "../utils/renderController";

const defaultContext = new RenderController();

/**
 * DynamicContext contains the various controllers used for the DynamicRender feature, including
 * storage.
 */
export const DynamicContext = createContext<RenderController>(defaultContext);
