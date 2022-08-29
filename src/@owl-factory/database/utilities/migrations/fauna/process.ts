import { RawMigration } from "@owl-factory/database/types/migrations/fauna";

// TODO - is any processing necessary?

/**
 * Processes raw migration data into useable migration data
 * @param rawMigrations The raw migration data to process
 * @returns A list of processed migration data
 */
export function processMigrations(rawMigrations: RawMigration[]) {
  const migrations = [];
  for (const rawMigration of rawMigrations) {
    migrations.push(processMigration(rawMigration));
  }
  return migrations;
}

/**
 * Processes a single migration file into something readable
 * @param rawMigration The raw migration to process
 * @returns A processed migration object
 */
function processMigration(rawMigration: RawMigration) {
  return rawMigration; // TODO
}
