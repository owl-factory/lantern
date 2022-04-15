
export enum MigrationAction {
  CREATE = "create",
  REMOVE = "remove",
  MOVE = "move",
  TRANSFORM = "transform",
  COPY = "copy",
}

// Raw migration information pulled in from a yaml file
export interface RawMigrationAction {
  action: MigrationAction;
  default?: string | number | boolean | any[];
  source?: string;
  target?: string;
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
