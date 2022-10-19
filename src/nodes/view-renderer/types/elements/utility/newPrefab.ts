import { ElementDescriptor } from "../generic";

/**
 * Describes a sheet NewPrefab element
 */
export interface NewPrefabDescriptor extends ElementDescriptor {
  name: string;
  children: ElementDescriptor[];
}
