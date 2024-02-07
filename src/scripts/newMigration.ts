import { writeFileSync } from "fs";

const template = `import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.createTable("PLACEHOLDER").addColumn("exampleArrayColumn", sql\`text[]\`);
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex("PLACEHOLDER");
}
`;

/**
 * Script that creates a new migration file in `migrations`.
 */
function newMigration(migrationName: string) {
  if (typeof migrationName !== "string") {
    console.error("please provide a migration name as the first argument.");
    process.exit(1);
  }
  const fileName = migrationName.endsWith(".ts") ? migrationName : migrationName + ".ts";
  const nowIso = new Date(Date.now()).toISOString();
  writeFileSync(`src/migrations/${nowIso}_${fileName}`, template);
}

const [, , migrationName] = process.argv;

newMigration(migrationName);