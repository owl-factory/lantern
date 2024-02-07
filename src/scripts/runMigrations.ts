import * as path from "path";
import { promises as fs } from "fs";
import { Migrator, FileMigrationProvider } from "kysely";
import { database } from "lib/database";

/**
 * Migration script function. It runs through ts-node via the npm script `migrate`.
 * The purpose of this script is to run all Kysely migrations in the migrations folder.
 * It is needed because Kysely, by design, has no migration CLI.
 */
async function runMigrations(migrationArg: string) {
  if (!process.env.DATABASE_URL) {
    console.log("DATABASE_URL environment variable is not defined, skipping migrations.");
    process.exit(0);
  }

  const migrator = new Migrator({
    db: database,
    provider: new FileMigrationProvider({
      fs,
      path,
      // This needs to be an absolute path.
      migrationFolder: path.join(__dirname, "../migrations"),
    }),
  });

  let res;
  if (
    !migrationArg ||
    migrationArg.toLowerCase() === "--latest" ||
    migrationArg.toLowerCase() === "-l"
  ) {
    res = await migrator.migrateToLatest();
  } else if (migrationArg === "--up" || migrationArg === "-u") {
    res = await migrator.migrateUp();
  } else if (migrationArg === "--down" || migrationArg === "-d") {
    res = await migrator.migrateDown();
  } else {
    console.error("invalid arguments");
    process.exit(1);
  }
  const { error, results } = res;

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

  if (results?.length === 0) {
    console.log("No migrations ran because the database is already up to date.");
  }
}

const [, , migrationArg] = process.argv;

runMigrations(migrationArg);
