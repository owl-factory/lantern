import { ImportMigrationResult } from "@owl-factory/database/types/migrations/fauna";
import { setDefaultDocument, setMigrations, setVersion } from "./access";
import { getMigrationFilenames, readMigrations } from "./file";
import { runDocumentMigrations } from "./migrate";
import { processMigrations } from "./process";
import { validateMigrations } from "./validate";

/**
 * Imports all migrations for a given collection
 * @param migrationPath The path to the directory containing the different migrations
 * @param collection The collection that migrations are being read in from
 * @throws Any error encountered while running. This should cause a failstate
 * @returns An object containing the version, default document, and a list of migrations
 */
 export function importMigrations(migrationPath: string, collection: string): ImportMigrationResult {
  // Returns version number, default object, and migrations
  // Get yaml file names
  const path = `${migrationPath}${collection}`;

  // Reads in all migrations and puts them into a useable format
  const migrationFilenames = getMigrationFilenames(path);
  const rawMigrations = readMigrations(path, migrationFilenames);
  validateMigrations(rawMigrations, collection);
  const migrations = processMigrations(rawMigrations);

  // Process migration objects into a default object
  const baseDocument = { _v: "0.0.0" };
  const defaultDocument = runDocumentMigrations(baseDocument, migrations);

  setVersion(collection, defaultDocument._v as string);
  setDefaultDocument(collection, defaultDocument);
  setMigrations(collection, migrations);

  return { defaultDocument, version: defaultDocument._v as string, migrations };
}


