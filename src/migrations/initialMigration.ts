/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely, sql } from "kysely";

/**
 * Function called by the migration script to apply 'initialMigration'.
 * @param db - Kysely query builder instance used for executing migration coe against the db.
 * It must be of type `any` due to the fact that this migration will still need to be run in it's
 * current state after the typescript schema changes.
 */
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
    .addColumn("api_key", "boolean", (col) => col.notNull().defaultTo(false))
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

/**
 * Function called by the migration script to undo 'initialMigration'.
 * @param db - Kysely query builder instance used for executing migration coe against the db.
 * It must be of type `any` due to the fact that this migration will still need to be run in it's
 * current state after the typescript schema changes.
 */
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("key").execute();
  await db.schema.dropTable("session").execute();
  await db.schema.dropTable("user").execute();
  await db.schema.dropTable("todo").execute();
}

/**
 * Function helper function called by {@link up | up()} to insert data.
 * @param db - Kysely query builder instance used for executing migration coe against the db.
 * It must be of type `any` due to the fact that this migration will still need to be run in it's
 * current state after the typescript schema changes.
 */
async function insertExampleData(db: Kysely<any>): Promise<void> {
  // Create development only auth/user data
  if (process.env.NODE_ENV === "development") {
    // user table
    const userId = "0cde4c19-3ec3-4e30-9540-939b45f74aa6";
    const user = {
      id: userId,
      username: "lanterndev",
      email: "dev@lanterntt.com",
      display_name: "Lantern Developer",
      icon_url: "https://lanterntt.com/images/cute-anime-girl-pfp.png",
    };
    await db.insertInto("user").values(user).execute();

    // key table
    const keys = [
      {
        id: "username:lanterndev",
        user_id: userId,
        hashed_password:
          "s2:qqk4kyzx4m4cdoei:6600f0ecdb9006cf009c457aa08160b82739827b1f567bb5c6d08525442eb1716461d2d96b79e71428a556fd05635649b436928df92ae97d59889e295b65e58d",
      },
      {
        id: "email:dev@lanterntt.com",
        user_id: userId,
        hashed_password:
          "s2:xxsitlyvxxdy1tq3:05ad00259571361edadc01a5699b095b805368fbcafc283ea4631ba9adcbe4d6ec2fb9ebda3614631b1d533fcd94998832fdc2cf08f08a37a409e8a5abfbaebf",
      },
    ];
    await db.insertInto("key").values(keys).execute();

    // session table - create long lived session for use as testing session
    const session = {
      id: process.env.TEST_AUTH_TOKEN,
      user_id: userId,
      // Expires Tuesday January 1 2030 08:00 GMT - It's going to be funny when tests fail in 6 years
      active_expires: 1893484800000,
      idle_expires: 1893484800000,
      api_key: true,
    };
    await db.insertInto("session").values(session).execute();
  }

  // todo table
  const todos = [
    {
      id: "57cc22f8-b4d5-44cb-a473-97b69911b9a0",
      description: "Kiss girls",
      done: true,
    },
    {
      id: "9a1b9592-ac20-4141-b18b-982b26c0bea7",
      description: "Complete Lantern",
      done: false,
    },
  ];
  await db.insertInto("todo").values(todos).execute();
}
