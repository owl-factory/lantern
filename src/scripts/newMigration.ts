import { writeFileSync } from "fs";
import { Now } from "utils/database";

/**
 * String used as content in newly generated migration files.
 */
const migrationTemplate = `import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.createTable("placeholder").addColumn("exampleColumn", "text").execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("placeholder").execute();
}
`;

/**
 * Script that creates a new migration file in `migrations` with a file name formatted as `{timestamp}_{migrationName}.ts`.
 * Example: `2024-02-07T21.30.40Z_initialMigration.ts`. The content of the file will always be the constant `migrationTemplate` string.
 * @param migrationName - name of migration file to join with migration timestamp.
 */
function newMigration(migrationName: string) {
  if (typeof migrationName !== "string") {
    console.error("please provide a migration name as the first argument.");
    process.exit(1);
  }
  const fileName = migrationName.endsWith(".ts") ? migrationName : migrationName + ".ts";
  // Create an ISO datetime string with the milliseconds portion removed and all
  // colons ':' replaced with periods '.'. This is because colons are illegal in windows filenames.
  const nowIso = Now().toISOString().replaceAll(":", ".").slice(0, -5) + "Z";
  writeFileSync(`src/migrations/${nowIso}_${fileName}`, migrationTemplate);
}

const [, , migrationName] = process.argv;

newMigration(migrationName);
