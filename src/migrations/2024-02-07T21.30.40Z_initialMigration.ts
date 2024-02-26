import { Kysely, sql } from "kysely";
import { contentIndexCount } from "utils/environment";
import "utils/kyselyExtensions";

/**
 * Function called by the migration script to apply 'initialMigration'.
 * @param db - Kysely query builder instance used for executing migration coe against the db.
 * It must be of type `any` due to the fact that this migration will still need to be run in it's
 * current state after the typescript schema changes.
 */
export async function up(db: Kysely<any>): Promise<void> {
  /* Enum Definitions */
  await db.schema.createType("group").asEnum(["admin", "user"]).execute();
  await db.schema.createType("visibility").asEnum(["public", "private", "friends"]).execute();
  /* End Enum Definitions */

  /* Authentication Tables */
  // user table
  await db.schema
    .createTable("user")
    .addBaseColumns()
    .addColumn("username", "text", (col) => col.notNull())
    .addColumn("email", "text", (col) => col.notNull())
    .addColumn("groups", sql`public.group[]`, (col) =>
      col.notNull().defaultTo(sql`ARRAY['user']::public.group[]`)
    )
    .addColumn("isOrganization", "boolean", (col) => col.notNull().defaultTo(false))
    .addColumn("displayName", "text")
    .addColumn("iconUrl", "text")
    .execute();

  // key table
  await db.schema
    .createTable("key")
    .addColumn("id", "text", (col) => col.notNull().primaryKey())
    .addBaseColumns(false)
    .addColumn("userId", "uuid", (col) => col.notNull().references("user.id"))
    .addColumn("hashedPassword", "text")
    .execute();

  // session table
  await db.schema
    .createTable("session")
    .addColumn("id", "varchar(40)", (col) => col.notNull().primaryKey())
    .addBaseColumns(false)
    .addColumn("userId", "uuid", (col) => col.notNull().references("user.id"))
    .addColumn("activeExpires", "bigint", (col) => col.notNull())
    .addColumn("idleExpires", "bigint", (col) => col.notNull())
    .addColumn("isApiKey", "boolean", (col) => col.notNull().defaultTo(false))
    .execute();
  /* End Authentication Tables */

  /* Primary Tables */
  // content table
  let contentTableBuilder = db.schema
    .createTable("content")
    .addBaseColumns()
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("ownerUserId", "uuid", (col) => col.notNull().references("user.id"))
    .addColumn("visibility", sql`visibility`, (col) => col.notNull().defaultTo("private"))
    .addColumn("isDynamic", "boolean", (col) => col.notNull())
    .addColumn("data", "jsonb");
  for (let i = 1; i <= contentIndexCount; i++) {
    contentTableBuilder = contentTableBuilder.addColumn("index" + i, "text");
  }
  contentTableBuilder.execute();

  // TODO get rid of this table and associated resolvers and frontend
  await db.schema
    .createTable("todo")
    .addBaseColumns()
    .addColumn("ownerUserId", "uuid", (col) => col.notNull().references("user.id"))
    .addColumn("description", "text")
    .addColumn("done", "boolean", (col) => col.notNull().defaultTo(false))
    .execute();
  /* End Primary Tables */

  /* Relationship Tables */
  /* End Relationship Tables */

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
  await db.schema.dropTable("todo").execute();
  await db.schema.dropTable("content").execute();
  await db.schema.dropTable("user").execute();

  await db.schema.dropType("visibility").execute();
  await db.schema.dropType("group").execute();
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
      displayName: "Lantern Developer",
      iconUrl: "https://lanterntt.com/images/cute-anime-girl-pfp.png",
    };
    await db.insertInto("user").values(user).execute();

    // key table
    const keys = [
      {
        id: "username:lanterndev",
        userId: userId,
        hashedPassword:
          "s2:qqk4kyzx4m4cdoei:6600f0ecdb9006cf009c457aa08160b82739827b1f567bb5c6d08525442eb1716461d2d96b79e71428a556fd05635649b436928df92ae97d59889e295b65e58d",
      },
      {
        id: "email:dev@lanterntt.com",
        userId: userId,
        hashedPassword:
          "s2:xxsitlyvxxdy1tq3:05ad00259571361edadc01a5699b095b805368fbcafc283ea4631ba9adcbe4d6ec2fb9ebda3614631b1d533fcd94998832fdc2cf08f08a37a409e8a5abfbaebf",
      },
    ];
    await db.insertInto("key").values(keys).execute();

    // session table - create long lived session for use as testing session
    const session = {
      id: process.env.TEST_AUTH_TOKEN,
      userId: userId,
      // Expires Tuesday January 1 2030 08:00 GMT - It's going to be funny when tests fail in 6 years
      activeExpires: 1893484800000,
      idleExpires: 1893484800000,
      isApiKey: true,
    };
    await db.insertInto("session").values(session).execute();
  }

  // todo table
  const todos = [
    {
      id: "57cc22f8-b4d5-44cb-a473-97b69911b9a0",
      ownerUserId: "0cde4c19-3ec3-4e30-9540-939b45f74aa6",
      description: "Kiss girls",
      done: true,
    },
    {
      id: "9a1b9592-ac20-4141-b18b-982b26c0bea7",
      ownerUserId: "0cde4c19-3ec3-4e30-9540-939b45f74aa6",
      description: "Complete Lantern",
      done: false,
    },
  ];
  await db.insertInto("todo").values(todos).execute();

  // content table
  const content = [
    {
      name: "No name",
      id: "02d4ff74-8767-449e-9f87-8327090a2e6d",
      ownerUserId: "0cde4c19-3ec3-4e30-9540-939b45f74aa6",
      visibility: "public",
      isDynamic: true,
      data: {
        description: "Kiss girls",
        done: true,
      },
    },
    {
      name: "No name",
      id: "99302d6d-9765-45d5-ac3d-34524b736282",
      ownerUserId: "0cde4c19-3ec3-4e30-9540-939b45f74aa6",
      visibility: "public",
      isDynamic: true,
      data: {
        description: "Complete Lantern",
        done: false,
      },
    },
  ];
  await db.insertInto("content").values(content).execute();
}
