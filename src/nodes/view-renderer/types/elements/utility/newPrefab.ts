import { GenericElementDescriptor } from "../generic";

/**
 * Describes a sheet NewPrefab element
 */
export interface NewPrefabDescriptor extends GenericElementDescriptor {
  name: string;
  children: GenericElementDescriptor[];
}
