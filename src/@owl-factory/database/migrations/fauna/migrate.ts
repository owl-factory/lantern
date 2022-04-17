import { MigrationAction, RawMigration, RawMigrationAction } from "@owl-factory/database/types/migrations/fauna";
import { read, set } from "@owl-factory/utilities/objects";

/**
 * Builds a default document object by parsing the list of migrations and building up what it expects
 * @param migrations The list of migrations to parse
 * @returns The default document, as determined by the migrations
 */
export function runDocumentMigrations(document: Record<string, unknown>, migrations: RawMigration[]) {
  if (document._v === undefined) { document._v = "0.0.0"; }

  for (const migration of migrations) {
    document = runDocumentMigration(document, migration);
  }

  return document;
}

/**
 * Runs a single migration upon a given document
 * @param document The document to migrate
 * @param migration The instructions for how to run a particular migration
 * @returns The migrated document
 */
function runDocumentMigration(document: Record<string, unknown>, migration: RawMigration): Record<string, unknown> {
  // Skip if this migration is earlier than the current version of the document
  if (migration.version <= (document._v as string)) { return document; }

  document._v = migration.version;
  const fields = Object.keys(migration.fields);
  for (const field of fields) {
    document = runFieldMigrations(migration.fields[field], field, document);
  }

  return document;
}

/**
 * Migrates a single field for a given document
 * @param fieldActions The actions for a field to run for a migration
 * @param field The name of the field being acted upon
 * @param document The document being migrated
 * @returns A document with one of its fields migrated
 */
function runFieldMigrations(
  fieldActions: RawMigrationAction[],
  field: string,
  document: Record<string, unknown>
): Record<string, unknown> {
  for (const action of fieldActions) {
    document = runFieldMigration(action, field, document);
  }
  return document;
}

/**
 * Runs one step of a document migration where a field has an action run upon it
 * @param action The action to run upon the given field
 * @param field The field to run an action upon
 * @param document The document to migrate
 * @returns The updated document
 */
function runFieldMigration(
  action: RawMigrationAction,
  field: string,
  document: Record<string, unknown>
): Record<string, unknown> {
  switch (action.action) {
    case MigrationAction.CREATE:
      // Check for previous value to prevent overwrites
      const value = read(document, field);
      if (value) break;

      set(document, field, action.default);
      break;
    case MigrationAction.COPY:
      if (!action.target) { break; }
      // TODO - apply transformation
      set(document, action.target, document[field]);
      break;
    case MigrationAction.MOVE:
      if (!action.target) { break; }
      set(document, action.target, document[field]);
      set(document, field, undefined);
      break;
    case MigrationAction.REMOVE:
      set(document, field, undefined);
      break;
    case MigrationAction.TRANSFORM:
      // TODO
      break;
  }
  return document;
}
