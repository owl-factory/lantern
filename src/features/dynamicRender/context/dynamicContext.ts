import { RenderController } from "features/dynamicRender/utils/renderController";
import { createContext } from "react";

const defaultContext = new RenderController();

/**
 * DynamicContext contains the various controllers used for the DynamicRender feature, including
 * storage.
 */
export const DynamicContext = createContext<RenderController>(defaultContext);
