import { GenericElementDescriptor } from "../generic";

/**
 * Describes a sheet prefab element
 */
export interface PrefabDescriptor extends GenericElementDescriptor {
  name: string;
  arguments: Record<string, unknown>;
  children: GenericElementDescriptor[];
}
