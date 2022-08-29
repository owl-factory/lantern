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
      document = createField(action, field, document);
      break;

    case MigrationAction.COPY:
      document = copyField(action, field, document);
      break;

    case MigrationAction.MOVE:
      document = copyField(action, field, document);
      document = removeField(action, field, document);
      break;

    case MigrationAction.REMOVE:
      document = removeField(action, field, document);
      break;

    case MigrationAction.TRANSFORM:
      document = transformField(action, field, document);
      break;
  }
  return document;
}

/**
 * Creates a field in a document and assigns it a default value, if one is not present already
 * @param action The full action for creating a field
 * @param field The name of the field to create
 * @param document The document to create the field in
 * @returns The document with the created field
 */
function createField(
  action: RawMigrationAction,
  field: string,
  document: Record<string, unknown>
): Record<string, unknown> {
  // Check for previous value to prevent overwrites
  const value = read(document, field);
  if (value) return document;

  set(document, field, action.default);
  return document;
}

/**
 * Copies a field in a document and assigns it to a different field
 * @param action The full action for copying a field
 * @param field The name of the field to copy to or from
 * @param document The document to copy the field in
 * @returns The document with the copied field
 */
function copyField(
  action: RawMigrationAction,
  field: string,
  document: Record<string, unknown>
): Record<string, unknown> {
  if (!action.target && !action.source) { return document; }
  const source = action.source || field;
  const target = action.target || field;

  // Check that the target can be set and return if it cannot
  const targetValue = read(document, target);
  if (targetValue && action.force !== true) { return document; }

  let value = read(document, source);
  if (action.transform) { value = runTransformation(action.transform, value); }
  // TODO - apply transformation
  set(document, target, value);
  return document;
}

/**
 * Removes a field in a document
 * @param action The full action for removing a field
 * @param field The name of the field to remove
 * @param document The document to remove the field from
 * @returns The document with the removed field
 */
function removeField(
  action: RawMigrationAction,
  field: string,
  document: Record<string, unknown>
): Record<string, unknown> {
  const source = action.source || field;
  document = set(document, source, undefined);
  return document;
}

/**
 * Transforms a field in a document
 * @param action The full action for transforming a field
 * @param field The name of the field to transform
 * @param document The document to transform the field in
 * @returns The document with the transformed field
 */
function transformField(
  action: RawMigrationAction,
  field: string,
  document: Record<string, unknown>
): Record<string, unknown> {
  let value = read(document, field);
  value = runTransformation(action.transform as string, value);
  document = set(document, field, undefined);
  return document;
}

/**
 * Transforms a value
 * @param transformName The name of the transformation to run
 * @param value The value to run the transformation on
 * @returns The transformed value
 */
function runTransformation(transformName: string, value: unknown) {
  return value;
}