import * as path from "path";
import { Pool } from "pg";
import { promises as fs } from "fs";
import { Kysely, Migrator, PostgresDialect, FileMigrationProvider } from "kysely";
import { Database } from "types/database";

/**
 * Migration script function. It runs through ts-node via the npm script `migrate`.
 * The purpose of this script is to run all Kysely migrations in the migrations folder.
 * It is needed because Kysely, by design, has no migration CLI.
 */
async function migrateToLatest() {
  console.log("TEST!");
  // const db = new Kysely<Database>({
  //   dialect: new PostgresDialect({
  //     pool: new Pool({
  //       host: "localhost",
  //       database: "kysely_test",
  //     }),
  //   }),
  // });

  // const migrator = new Migrator({
  //   db,
  //   provider: new FileMigrationProvider({
  //     fs,
  //     path,
  //     // This needs to be an absolute path.
  //     migrationFolder: path.join(__dirname, "some/path/to/migrations"),
  //   }),
  // });

  // const { error, results } = await migrator.migrateToLatest();

  // results?.forEach((it) => {
  //   if (it.status === "Success") {
  //     console.log(`migration "${it.migrationName}" was executed successfully`);
  //   } else if (it.status === "Error") {
  //     console.error(`failed to execute migration "${it.migrationName}"`);
  //   }
  // });

  // if (error) {
  //   console.error("failed to migrate");
  //   console.error(error);
  //   process.exit(1);
  // }

  // await db.destroy();
}

migrateToLatest();
