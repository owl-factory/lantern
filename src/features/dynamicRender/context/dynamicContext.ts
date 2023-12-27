import { createContext } from "react";
import { StorageController } from "../types/storage";
import { NullStorageController } from "../utils/storage/null";

export type DynamicContextContents = {
  storage: StorageController;
};

const defaultContext: DynamicContextContents = {
  storage: new NullStorageController(),
};

/**
 * DynamicContext contains the various controllers used for the DynamicRender feature, including
 * storage.
 */
export const DynamicContext = createContext<DynamicContextContents>(defaultContext);
