/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("todos")
    .addColumn("id", "uuid", (col) =>
      col
        .notNull()
        .primaryKey()
        .defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("description", "text")
    .addColumn("done", "boolean", (col) => col.notNull())
    .execute();

  await db.schema.createIndex("todos_id_index").on("todos").column("id").execute();

  const todo = {
    description: "kiss girls.",
    done: false,
  };
  await db.insertInto("todos").values(todo).execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("todos").execute();
}
