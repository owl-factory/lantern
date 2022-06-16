import { GenericSheetElementDescriptor } from "types/sheetElementDescriptors/generic";

/**
 * Describes a sheet NewPrefab element
 */
export interface NewPrefabElementDescriptor extends GenericSheetElementDescriptor {
  name: string;
  children: GenericSheetElementDescriptor[];
}
