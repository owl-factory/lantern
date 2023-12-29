import { Insertable, Selectable, Updateable } from "kysely";

export type Database = {
  user: UserTable;
  key: KeyTable;
  session: SessionTable;
  todo: TodoTable;
};

export type TodoTable = {
  id: string;
  description: string | null;
  done: boolean;
};

export type Todo = Selectable<TodoTable>;
export type NewTodo = Insertable<TodoTable>;
export type TodoUpdate = Updateable<TodoTable>;

export type UserTable = {
  id: string;
} & Lucia.DatabaseUserAttributes;

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;

export type KeyTable = {
  id: string;
  user_id: string;
  hashed_password: string | null;
};

export type Key = Selectable<KeyTable>;
export type NewKey = Insertable<KeyTable>;
export type KeyUpdate = Updateable<KeyTable>;

export type SessionTable = {
  id: string;
  user_id: string;
  active_expires: bigint;
  idle_expires: bigint;
} & Lucia.DatabaseSessionAttributes;

export type Session = Selectable<SessionTable>;
export type NewSession = Insertable<SessionTable>;
export type SessionUpdate = Updateable<SessionTable>;
