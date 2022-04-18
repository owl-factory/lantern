import { MigrationAction, RawMigration } from "../../types/migrations/fauna";

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
        validateField(action, "default", ["string", "null"], identifier);
        break;

      case MigrationAction.COPY:
        if (!action.source && !action.target) {
          throw `Migration for ${identifier} action copy requires either a target or source field`;
        }
        if ("force" in action && typeof action.force !== "boolean") {
          throw `Migration for ${identifier} descriptor 'force' must be of type boolean`;
        }
        if ("transform" in action) { 
          validateTransform(action.transform);
        }
        break;

      case MigrationAction.MOVE:
        if (!action.source && !action.target) {
          throw `Migration for ${identifier} action copy requires either a target or source field`;
        }
        if ("force" in action && typeof action.force !== "boolean") {
          throw `Migration for ${identifier} descriptor 'force' must be of type boolean`;
        }
        if ("transform" in action) { 
          validateTransform(action.transform);
        }
        break;
      
      case MigrationAction.REMOVE: 
        // No validation required
        break;

      case MigrationAction.TRANSFORM:
        validateField(action, "transform", ["string"], identifier);

        if ("transform" in action) { 
          validateTransform(action.transform);
        }
        break;
      default:
        throw `Migration for ${identifier} has an invalid action '${action.action}'`;
    }
  }
}

/**
 * Validates a single field in a migration action
 * @param migrationAction The migration action containing the field to validate
 * @param field The field in the migration action to validate
 * @param types The type the field should be
 * @param identifier An identifier for the error messages
 */
function validateField(
  migrationAction: Record<string, unknown>,
  field: string,
  types: string | string[],
  identifier: string
) {
  if (migrationAction[field] === undefined) { throw `Migration for ${identifier} requires the field '${field}'`; }
  // validateType(migrationAction, field, types, identifier);
}

function validateType(
  migrationAction: Record<string, unknown>,
  field: string,
  types: string | string[],
  identifier: string
) {
  if (!Array.isArray(types)) { types = [types]; }

  let valid = false;

  for (const type of types) {
    valid = valid || (typeof migrationAction[field] === type);
  }
  if (valid === false) {throw `Migration for ${identifier} field must be of type(s) '${types.toString()}'`; }
}

/**
 * Validates the transform action, ensuring that it's present
 * @param transformAction The transform action to validate
 */
function validateTransform(transformAction: string) {

}