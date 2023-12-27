import { createContext } from "react";
import { StorageController } from "../types/storage";
import { NullStorageController } from "../utils/storage/controllers/null";
import { MarkupController } from "../types/markup";
import { NullMarkupController } from "../utils/markup/controllers/null";

export type DynamicContextContents = {
  markup: MarkupController;
  storage: StorageController;
};

const defaultContext: DynamicContextContents = {
  markup: new NullMarkupController(),
  storage: new NullStorageController(),
};

/**
 * DynamicContext contains the various controllers used for the DynamicRender feature, including
 * storage.
 */
export const DynamicContext = createContext<DynamicContextContents>(defaultContext);
