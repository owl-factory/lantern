import { createContext } from "react";
import { ContextController } from "../utils/contextController";

const defaultContext = new ContextController();

/**
 * DynamicContext contains the various controllers used for the DynamicRender feature, including
 * storage.
 */
export const DynamicContext = createContext<ContextController>(defaultContext);
