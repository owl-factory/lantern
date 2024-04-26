/**
 * This file is a series of extension methods for Kysely's built in query builder classes.
 * You need to import the whole file to use them like so `import "utils/kyselyExtensions";`
 */
import { CreateTableBuilder, sql } from "kysely";

declare module "kysely/dist/cjs/schema/create-table-builder" {
  interface CreateTableBuilder<TB extends string, C extends string = never> {
    /**
     * Kysely table builder extension method for adding a properly configured standard Lantern `id` table. Equivalent to:
     * ```ts
     * tableBuilder.addColumn("id", "uuid", (col) =>
     *   col
     *     .notNull()
     *     .primaryKey()
     *     .defaultTo(sql`gen_random_uuid()`)
     * );
     * ```
     * @param columnName - Override name for the ID column (defaults to "id").
     */
    addIdColumn<CN extends string = "id">(columnName?: CN): CreateTableBuilder<TB, C | CN>;
    /**
     * Kysely table builder extension method adding Lantern's standard baseic columns to a table. Will not be used on certain
     * authorization and relationship tables.
     * ```ts
     * tableBuilder.addIdColumn()
     *   .addColumn("createdAt", "timestamp", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
     *   .addColumn("updatedAt", "timestamp", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`));
     * ```
     * @param includeId - Whether to add the default Lantern ID column, defaults to true.
     */
    addBaseColumns(includeId?: boolean): CreateTableBuilder<TB, C>;
  }
}

CreateTableBuilder.prototype.addIdColumn = function (
  this: CreateTableBuilder<never, never>,
  columnName?: string
) {
  return this.addColumn(columnName || "id", "uuid", (col) =>
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
