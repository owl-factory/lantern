import { StorageType } from "./storage";
import { TargetType } from "./targetType";

/**
 * The options used by the Dynamic Render factories to determine
 * which Controllers to create for a dependency
 */
export type FactoryOptions = {
  targetId: string;
  targetType: TargetType;
  storageType: StorageType;
};
