// Describes the attributes of the Prefab element
export interface PrefabAttributes {
  name: string; // The name of the prefab to use
  arguments: Record<string, string>; // TODO - make Record<string, Expression>
}
