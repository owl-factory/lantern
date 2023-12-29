import { Insertable, Selectable, Updateable } from "kysely";

export type Database = {
  todos: TodosTable;
  users: UsersTable;
  keys: KeysTable;
  sessions: SessionsTable;
};

export type TodosTable = {
  id: string;
  description?: string;
  done: boolean;
};

export type Todo = Selectable<TodosTable>;
export type NewTodo = Insertable<TodosTable>;
export type TodoUpdate = Updateable<TodosTable>;

export type UsersTable = {
  id: string;
} & Lucia.DatabaseUserAttributes;

export type User = Selectable<UsersTable>;
export type NewUser = Insertable<UsersTable>;
export type UserUpdate = Updateable<UsersTable>;

export type KeysTable = {
  id: string;
  user_id: string;
  hashed_password?: string;
};

export type Key = Selectable<KeysTable>;
export type NewKey = Insertable<KeysTable>;
export type KeyUpdate = Updateable<KeysTable>;

export type SessionsTable = {
  id: string;
  user_id: string;
  active_expires: bigint;
  idle_expires: bigint;
} & Lucia.DatabaseSessionAttributes;

export type Session = Selectable<SessionsTable>;
export type NewSession = Insertable<SessionsTable>;
export type SessionUpdate = Updateable<SessionsTable>;
