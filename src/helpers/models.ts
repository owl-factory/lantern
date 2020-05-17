import mongo from "mongoose";

/**
 * Builds a new model or reuses an existing one to prevent issues with redefining a model
 *
 * @param modelName The name of the model to use, like "Character"
 * @param schema The mongo schema definition for the model
 * @param collection The collection this schema references.
 */
export function getModel(modelName: string, schema: any, collection?: string) {
  const modelNameWithVersion = modelName + "_" + getVersion(modelName);

  try {
    mongo.model(modelNameWithVersion);
    return mongo.model(modelNameWithVersion);

  } catch (e) {
    return mongo.model(modelNameWithVersion, schema, collection);
  }
}

/**
 * Fetches the version for the given modelname
 * @param modelName The model name (without version) whose version is to be searched for
 */
export function getVersion(modelName: string): string {
  const versions: any = {
    "Character": 1,
  };

  if (modelName in versions) {
    return versions[modelName];
  }
  return "no-version";
}
