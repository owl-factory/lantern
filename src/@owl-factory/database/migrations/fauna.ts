import { isClient } from "@owl-factory/utilities/client";
import fs from "fs";
import * as yaml from "js-yaml";

type Migration = any;

export const MIGRATION_VERSIONS: Record<string, string> = {};

export function importMigrations(migrationPath: string, collection: string) {
  // Returns version number, default object, and migrations
  // Get yaml file names
  const path = `${migrationPath}${collection}`;

  const migrationFilenames = getMigrationFilenames(path);
  const rawMigrations = readMigrations(path, migrationFilenames);
  const migrations = processMigrations(rawMigrations);

  // Process migration objects into a default object
  const defaultDocument = buildDefaultDocument(migrations);
  const version = defaultDocument.version;

  return { defaultDocument, version, migrations };
}

function getMigrationFilenames(path: string) {
  if (isClient) { throw "Fatal Error - Migrations can only be run serverside"; }
  const files = fs.readdirSync(path);
  const migrationFiles: string[] = [];

  for (const file of files) {
    if (file.match(/^v[1-9][0-9]*.[1-9]*[0-9].[1-9]*[0-9].(yaml|yml)$/) !== null) { migrationFiles.push(file); }
  }

  migrationFiles.sort();
  return migrationFiles;
}

function readMigrations(path: string, filenames: string[]) {
  const migrations: Migration[] = [];
  for (const filename of filenames) {
    try {
      migrations.push(readMigration(path, filename));
    } catch (e) {
      console.error(e);
    }
  }
  return migrations;
}

function readMigration(path: string, filename: string) {
  const migrationPath = `${path}/${filename}`;
  const version = filename.replace(/\.(yaml|yml)$/, "").substr(1); // TODO - move to it's own function?

  const migration: Migration = yaml.load(fs.readFileSync(path, "utf8"));
  migration.version = version;
  return migration;
}

function processMigrations(rawMigrations: Migration[]) {
  const migrations = [];
  for (const rawMigration of rawMigrations) {
    migrations.push(processMigration(rawMigration));
  }
  return migrations;
}

function processMigration(rawMigration: Migration) {
  return rawMigration; // TODO
}

function buildDefaultDocument(migrations: any) {
  const defaultDocument = {
    version: "0.0.0",
  };

  for (const migration of migrations) {
    defaultDocument.version = migration.version;
  }

  return defaultDocument;
}

// Actions 
// Create (w/ default), default (set default), remove (w/ move, if wanted), move, copy, transform?