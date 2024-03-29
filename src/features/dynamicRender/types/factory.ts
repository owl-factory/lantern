import { MarkupSource } from "./controllers/loader";
import { MarkupServeType } from "./controllers/markup";
import { StorageType } from "./controllers/storage";
import { TargetType } from "./targetType";

/**
 * The options used by the Dynamic Render factories to determine
 * which Controllers to create for a dependency
 */
export type FactoryOptions = {
  targetId: string;
  targetType: TargetType;
  storageType: StorageType;

  markupServeType: MarkupServeType;
} & MarkupSourceFactoryOptions;

type MarkupSourceFactoryOptions = {
  markupSource: MarkupSource.Hardcoded;
  uri: string;
};
