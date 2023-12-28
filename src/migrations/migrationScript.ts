import * as path from "path";
import { promises as fs } from "fs";
import { Migrator, FileMigrationProvider } from "kysely";
import { database } from "lib/database";

/**
 * Migration script function. It runs through ts-node via the npm script `migrate`.
 * The purpose of this script is to run all Kysely migrations in the migrations folder.
 * It is needed because Kysely, by design, has no migration CLI.
 */
async function migrateToLatest() {
  const migrator = new Migrator({
    db: database,
    provider: new FileMigrationProvider({
      fs,
      path,
      // This needs to be an absolute path.
      migrationFolder: __dirname,
    }),
  });

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === "Success") {
      console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === "Error") {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error("failed to migrate");
    console.error(error);
    process.exit(1);
  }

  await database.destroy();
}

migrateToLatest();
