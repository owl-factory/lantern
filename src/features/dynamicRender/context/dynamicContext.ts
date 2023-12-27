import { createContext } from "react";
import { StorageController } from "../types/storage";
import { MarkupController } from "../types/markup";
import { ContextController } from "../utils/contextController";

export type DynamicContextContents = {
  markup: MarkupController;
  storage: StorageController;
};

const defaultContext = new ContextController();

/**
 * DynamicContext contains the various controllers used for the DynamicRender feature, including
 * storage.
 */
export const DynamicContext = createContext<ContextController>(defaultContext);
