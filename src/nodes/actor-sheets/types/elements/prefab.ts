import { GenericSheetElementDescriptor } from "./generic";

/**
 * Describes a sheet prefab element
 */
export interface PrefabElementDescriptor extends GenericSheetElementDescriptor {
  name: string;
  arguments: Record<string, unknown>;
  children: GenericSheetElementDescriptor[];
}
