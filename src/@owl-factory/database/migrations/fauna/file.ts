import { RawMigration, RawMigrationAction } from "@owl-factory/database/types/migrations/fauna";
import { isClient } from "@owl-factory/utilities/client";
import * as yaml from "js-yaml";
import fs from "fs";

/**
 * Determines the migration files contained within a specific directory
 * @param path The path to read for migration filenames
 * @returns A list of migration filenames sorted descending
 */
export function getMigrationFilenames(path: string): string[] {
  if (isClient) { throw "Fatal Error - Migrations can only be run serverside"; }
  const files = fs.readdirSync(path);
  const migrationFiles: string[] = [];

  for (const file of files) {
    if (file.match(/^v[1-9][0-9]*.[1-9]*[0-9].[1-9]*[0-9].(yaml|yml)$/) !== null) { migrationFiles.push(file); }
  }

  migrationFiles.sort();
  return migrationFiles;
}

/**
 * Reads and returns the raw migration data
 * @param path The path to the directory containing migrations
 * @param filenames The filenames of the migrations to import
 * @returns A list of all raw migration data
 */
export function readMigrations(path: string, filenames: string[]): RawMigration[] {
  const migrations: RawMigration[] = [];
  for (const filename of filenames) {
    try {
      migrations.push(readMigration(path, filename));
    } catch (e) {
      console.error(e);
    }
  }
  return migrations;
}

/**
 * Reads in a migration from a yaml file
 * @param path The path of the directory containing the migration data
 * @param filename The name of the migration filename to import
 * @returns The raw, unvalidated migration data for the given migration file
 */
function readMigration(path: string, filename: string) {
  const migrationPath = `${path}/${filename}`;
  const version = filename.replace(/\.(yaml|yml)$/, "").substr(1); // TODO - move to it's own function?

  const migration: RawMigration = { version, fields: {} };
  migration.fields = yaml.load(fs.readFileSync(migrationPath, "utf8")) as Record<string, RawMigrationAction[]>;

  return migration;
}