import { GenericSheetElementDescriptor } from "nodes/actor-sheets/types/elements/generic";

/**
 * Describes a sheet NewPrefab element
 */
export interface NewPrefabDescriptor extends GenericSheetElementDescriptor {
  name: string;
  children: GenericSheetElementDescriptor[];
}
