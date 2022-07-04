import { GenericSheetElementDescriptor } from "nodes/actor-sheets/types/elements/generic";

/**
 * Describes a sheet NewPrefab element
 */
export interface NewPrefabElementDescriptor extends GenericSheetElementDescriptor {
  name: string;
  children: GenericSheetElementDescriptor[];
}
