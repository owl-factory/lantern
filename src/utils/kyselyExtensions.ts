/**
 * This file is a series of extension methods for Kysely's built in query builder classes.
 * You need to import the whole file to use them like so `import "utils/kyselyExtensions";`
 */

import { CreateTableBuilder, sql } from "kysely";

declare module "kysely/dist/cjs/schema/create-table-builder" {
  interface CreateTableBuilder<TB extends string, C extends string = never> {
    addIdColumn<CN extends string = "id">(col?: CN): CreateTableBuilder<TB, C | CN>;
    addBaseColumns(includeId?: boolean): CreateTableBuilder<TB, C>;
  }
}

CreateTableBuilder.prototype.addIdColumn = function (
  this: CreateTableBuilder<never, never>,
  col?: string
) {
  return this.addColumn(col || "id", "uuid", (col) =>
    col
      .notNull()
      .primaryKey()
      .defaultTo(sql`gen_random_uuid()`)
  );
};

CreateTableBuilder.prototype.addBaseColumns = function (
  this: CreateTableBuilder<never, never>,
  includeId: boolean = true
) {
  return (includeId ? this.addIdColumn() : this)
    .addColumn("createdAt", "timestamp", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "timestamp", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`));
};
