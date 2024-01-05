import { Insertable, Selectable, Updateable } from "kysely";

/**
 * Kysely query builder database type. Defines all queryable tables.
 * The schema should match tables created in `migrations`, so a migration needs
 * to be created or edited if any tables or columns are changes here.
 */
export type Database = {
  user: UserTable;
  key: KeyTable;
  session: SessionTable;
  todo: TodoTable;
};

/**
 * 'todo' table schema.
 */
export type TodoTable = {
  id: string;
  description?: string;
  done: boolean;
};

export type Todo = Selectable<TodoTable>;
export type NewTodo = Insertable<TodoTable>;
export type TodoUpdate = Updateable<TodoTable>;

/**
 * 'user' table schema. This table required for Lucia Auth.
 * Additional columns should be added in lucia.d.ts as part of the DatabaseUserAttribute instead of here.
 */
export type UserTable = {
  id: string;
} & Lucia.DatabaseUserAttributes;

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;

/**
 * 'key' table schema. This table required for Lucia Auth.
 * Do not add extra columns.
 */
export type KeyTable = {
  id: string;
  user_id: string;
  hashed_password: string | null;
};

export type Key = Selectable<KeyTable>;
export type NewKey = Insertable<KeyTable>;
export type KeyUpdate = Updateable<KeyTable>;

/**
 * 'session' table schema. This table required for Lucia Auth.
 * Additional columns should be added in lucia.d.ts as part of the DatabaseUserAttribute instead of here.
 */
export type SessionTable = {
  id: string;
  user_id: string;
  active_expires: bigint;
  idle_expires: bigint;
} & Lucia.DatabaseSessionAttributes;

export type Session = Selectable<SessionTable>;
export type NewSession = Insertable<SessionTable>;
export type SessionUpdate = Updateable<SessionTable>;
