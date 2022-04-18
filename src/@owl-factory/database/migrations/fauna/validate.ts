import { Migration, MigrationAction, RawMigration, RawMigrationAction } from "../../types/migrations/fauna";

/**
 * Validates a list of migrations for a given collection
 * @param rawMigrations The raw migrations to validate
 * @param collection The collection that the migrations belong to
 */
export function validateMigrations(rawMigrations: RawMigration[], collection: string): void {
  for (const migration of rawMigrations) {
    validateMigration(migration, collection);
  }
}

/**
 * Validates a single migration
 * @param migration The migration object to validate
 * @param collection The collection that the migration object is for
 */
function validateMigration(migration: any, collection: string) {
  // Validate version

  // Validate fields
  if (migration.fields === undefined || typeof migration.fields !== "object") {
    throw `Migration for ${collection} v${migration.version} is not a valid migration object`;
  }
  const keys = Object.keys(migration.fields);
  for (const key of keys) {
    const identifier = `${collection} v${migration.version} of field ${key}`;
    validateMigrationActions(migration.fields[key], identifier);
  }
}

/**
 * Validates the migration actions for a migration
 * @param migrationActions The migration actions to validate
 * @param identifier An identifier for the error messages
 */
function validateMigrationActions(migrationActions: any, identifier: string) {
  if (typeof migrationActions !== "object" && Array.isArray(migrationActions)) {
    throw `The migrations for ${identifier} must be an array of actions`;
  }

  for (const action of migrationActions) {
    switch(action.action) {
      case MigrationAction.CREATE:
        validateCreate(action, identifier);
        break;

      case MigrationAction.COPY:
      case MigrationAction.MOVE:
        validateCopy(action, identifier);
        break;

      case MigrationAction.REMOVE:
        // No validation required
        break;

      case MigrationAction.TRANSFORM:
        validateTransform(action, identifier);
        break;
      default:
        throw `Migration for ${identifier} has an invalid action '${action.action}'`;
    }
  }
}

/**
 * Validates all fields required for the create action
 * @param action The create migration action
 * @param identifier An identifier string for throwing errors
 */
function validateCreate(action: RawMigrationAction, identifier: string) {
  requireField("default", action, identifier);
}

/**
 * Validates all fields required for the copy action
 * @param action The copy migration action
 * @param identifier An identifier string for throwing errors
 */
function validateCopy(action: RawMigrationAction, identifier: string) {
  if (!requireField("source", action, identifier, false) && !requireField("target", action, identifier, false)) {
    throw `Migration for ${identifier} action ${action.action} requires either a target or source field`;
  }
  requireType("source", "string", action, identifier);
  requireType("target", "string", action, identifier);
  requireType("transform", "string", action, identifier);
  requireValidTransform(action, identifier);
}

/**
 * Validates all fields required for the transform action
 * @param action The create migration action
 * @param identifier An identifier string for throwing errors
 */
function validateTransform(action: RawMigrationAction, identifier: string) {
  requireField("transform", action, identifier);
  requireType("transform", "string", action, identifier);
  requireValidTransform(action, identifier);
}

/**
 * Checks if the given field is present in the action
 * @param field The field to require
 * @param action The migration action to check for the field
 * @param identifier An identifier string for throwing errors
 * @param shouldThrow Whether or not the function should throw on error
 * @returns Boolean if no error is thrown
 */
function requireField(
  field: keyof RawMigrationAction,
  action: RawMigrationAction,
  identifier: string,
  shouldThrow = true
): boolean | undefined {
  if (action[field] !== undefined) { return true; }
  if (shouldThrow) {throw `Migration for ${identifier} requires the field '${field}'`; }
  return false;
}

/**
 * Checks if the given field is has the correct type, if present
 * @param field The field to verify the type of, if present
 * @param action The migration action to check for the field's type
 * @param identifier An identifier string for throwing errors
 * @param shouldThrow Whether or not the function should throw on error
 * @returns Boolean if no error is thrown
 */
function requireType(
  field: keyof RawMigrationAction,
  type: string,
  action: RawMigrationAction,
  identifier: string,
  shouldThrow = true
): boolean | undefined {
  if (action[field] === undefined || typeof action[field] === type) { return true; }
  if (shouldThrow) { throw `Migration for ${identifier} must have type ${type} for the field '${field}'`; }
  return false;
}

/**
 * Checks if the given field is has the correct type, if presentww
 * @param action The migration action to check for the field's type
 * @param identifier An identifier string for throwing errors
 * @param shouldThrow Whether or not the function should throw on error
 * @returns Boolean if no error is thrown
 */
function requireValidTransform(
  action: RawMigrationAction,
  identifier: string,
  shouldThrow = true
) {
  return true;
}
