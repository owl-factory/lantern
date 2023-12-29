/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  // users table
  await db.schema
    .createTable("user")
    .addColumn("id", "text", (col) => col.notNull().primaryKey())
    .addColumn("username", "text", (col) => col.notNull())
    .addColumn("email", "text", (col) => col.notNull())
    .addColumn("display_name", "text")
    .addColumn("icon_url", "text")
    .execute();

  // keys table
  await db.schema
    .createTable("key")
    .addColumn("id", "text", (col) => col.notNull().primaryKey())
    .addColumn("user_id", "text", (col) => col.notNull().references("user.id"))
    .addColumn("hashed_password", "text")
    .execute();

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

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("todo").execute();
}
