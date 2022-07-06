import { GenericSheetElementDescriptor } from "./generic";

/**
 * Describes a sheet prefab element
 */
export interface PrefabDescriptor extends GenericSheetElementDescriptor {
  name: string;
  arguments: Record<string, unknown>;
  children: GenericSheetElementDescriptor[];
}
