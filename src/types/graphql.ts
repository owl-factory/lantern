import { SelectExpression } from "kysely";
import { DB } from "types/database";

export type * from "generated/resolvers-types";

export type SelectFields<T extends keyof DB> = SelectExpression<DB, T>[];
