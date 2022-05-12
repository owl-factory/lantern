
export enum MigrationAction {
  CREATE = "create",
  REMOVE = "remove",
  MOVE = "move",
  TRANSFORM = "transform",
  COPY = "copy",
}

// Raw migration information pulled in from a yaml file
export interface RawMigrationAction {
  action: MigrationAction; // The type of action being taken by the migration
  default?: string | number | boolean | any[]; // The default value to use when creating a field
  source?: string; // The source field for pulling data
  target?: string; // The target field to set
  force?: boolean; // Forces an overwrite if data is present
  transform?: string; // The name of the transformation action to run on the value
}
export interface RawMigration {
  version: string;
  fields: Record<string, RawMigrationAction[]>
}
export type Migration = any;

// Result from the importMigrations function
export interface ImportMigrationResult {
  version: string;
  defaultDocument: Record<string, unknown>;
  migrations: Migration[];
}
