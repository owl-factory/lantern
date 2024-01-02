/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  /* Lucia Auth tables */
  // user table
  await db.schema
    .createTable("user")
    .addColumn("id", "uuid", (col) => col.notNull().primaryKey())
    .addColumn("username", "text", (col) => col.notNull())
    .addColumn("email", "text", (col) => col.notNull())
    .addColumn("display_name", "text")
    .addColumn("icon_url", "text")
    .execute();

  // key table
  await db.schema
    .createTable("key")
    .addColumn("id", "text", (col) => col.notNull().primaryKey())
    .addColumn("user_id", "uuid", (col) => col.notNull().references("user.id"))
    .addColumn("hashed_password", "text")
    .execute();

  // session table
  await db.schema
    .createTable("session")
    .addColumn("id", "varchar(40)", (col) => col.notNull().primaryKey())
    .addColumn("user_id", "uuid", (col) => col.notNull().references("user.id"))
    .addColumn("active_expires", "bigint", (col) => col.notNull())
    .addColumn("idle_expires", "bigint", (col) => col.notNull())
    .execute();
  /* end Lucia Auth tables */

  // todos table
  await db.schema
    .createTable("todo")
    .addColumn("id", "uuid", (col) =>
      col
        .notNull()
        .primaryKey()
        .defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("description", "text")
    .addColumn("done", "boolean", (col) => col.notNull().defaultTo(false))
    .execute();

  await insertExampleData(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("key").execute();
  await db.schema.dropTable("session").execute();
  await db.schema.dropTable("user").execute();
  await db.schema.dropTable("todo").execute();
}

async function insertExampleData(db: Kysely<any>): Promise<void> {
  const todos = [
    {
      description: "Kiss girls",
      done: true,
    },
    {
      description: "Complete Lantern",
      done: false,
    },
  ];
  await db.insertInto("todo").values(todos).execute();
}
