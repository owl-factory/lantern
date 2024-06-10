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
  await db.schema
    .createType("visibility")
    .asEnum(["public", "friends", "limited", "private"])
    .execute();
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
  // ruleset table
  await db.schema
    .createTable("ruleset")
    .addBaseColumns()
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("ownerUserId", "uuid", (col) => col.notNull().references("user.id"))
    .addColumn("visibility", sql`visibility`, (col) => col.notNull().defaultTo("private"))
    .execute();

  // contentType table
  await db.schema
    .createTable("contentType")
    .addBaseColumns()
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("ownerUserId", "uuid", (col) => col.notNull().references("user.id"))
    .addColumn("rulesetId", "uuid", (col) => col.references("ruleset.id"))
    .addColumn("visibility", sql`visibility`, (col) => col.notNull().defaultTo("private"))
    .execute();

  // content table
  let contentTableBuilder = db.schema
    .createTable("content")
    .addBaseColumns()
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("ownerUserId", "uuid", (col) => col.notNull().references("user.id"))
    .addColumn("visibility", sql`visibility`, (col) => col.notNull().defaultTo("private"))
    .addColumn("isDynamic", "boolean", (col) => col.notNull().defaultTo(true))
    .addColumn("contentTypeId", "uuid", (col) => col.references("contentType.id"))
    .addColumn("rulesetId", "uuid", (col) => col.references("ruleset.id"))
    .addColumn("data", "jsonb");
  for (let i = 1; i <= contentIndexCount; i++) {
    contentTableBuilder = contentTableBuilder.addColumn("index" + i, "text");
  }
  contentTableBuilder.execute();
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
  await db.schema.dropTable("content").execute();
  await db.schema.dropTable("contentType").execute();
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
  // TODO pull this from an environment variable
  const defaultUserHash =
    "s2:xxsitlyvxxdy1tq3:05ad00259571361edadc01a5699b095b805368fbcafc283ea4631ba9adcbe4d6ec2fb9ebda3614631b1d533fcd94998832fdc2cf08f08a37a409e8a5abfbaebf";
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
      hashedPassword: defaultUserHash,
    },
    {
      id: "email:dev@lanterntt.com",
      userId: userId,
      hashedPassword: defaultUserHash,
    },
  ];
  await db.insertInto("key").values(keys).execute();

  // Only create extra long lived session for unit e2e testing in development.
  if (process.env.NODE_ENV === "development") {
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

  // contentType table data
  const todoContentType = {
    name: "Todo List Item",
    id: "904c33ee-f41c-4227-8192-16c41dbc206f",
    ownerUserId: userId,
    visibility: "public",
  };
  await db.insertInto("contentType").values(todoContentType).execute();

  // content table data
  const content = [
    {
      name: "Kiss girls",
      id: "02d4ff74-8767-449e-9f87-8327090a2e6d",
      ownerUserId: userId,
      visibility: "public",
      contentTypeId: "904c33ee-f41c-4227-8192-16c41dbc206f",
      data: {
        description: "Kiss girls",
        done: true,
      },
    },
    {
      name: "Complete Lantern Tabletop project",
      id: "99302d6d-9765-45d5-ac3d-34524b736282",
      ownerUserId: userId,
      visibility: "public",
      contentTypeId: "904c33ee-f41c-4227-8192-16c41dbc206f",
      data: {
        description: "Complete Lantern Tabletop project",
        done: false,
      },
    },
    {
      name: "Buy butts at the store",
      id: "835f50d2-e05d-424b-9efd-84cef3117ca3",
      ownerUserId: userId,
      visibility: "public",
      contentTypeId: "904c33ee-f41c-4227-8192-16c41dbc206f",
      data: {
        description: "Buy butts at the store",
        done: false,
      },
    },
    {
      name: "Lucina",
      id: "76256d0a-7cb7-4d14-8cdc-a4e08300e3eb",
      ownerUserId: userId,
      visibility: "public",
      data: {
        purpose:
          "This content exists to showcase that we can properly filter content by Content Type.",
        level: "8",
        hp: "27",
        strength: "9",
        magic: "2",
        skill: "12",
        speed: "10",
        luck: "11",
        defense: "8",
        resistance: "4",
        move: "5",
      },
    },
  ];
  await db.insertInto("content").values(content).execute();
}
