import { ElementDescriptor } from "../generic";

/**
 * Describes a sheet prefab element
 */
export interface PrefabDescriptor extends ElementDescriptor {
  name: string;
  arguments: Record<string, unknown>;
  children: ElementDescriptor[];
}
