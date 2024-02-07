import type { Insertable, Selectable, Updateable } from "kysely";
import type { Key, Session, Todo, User } from "generated/database-types";

export type SelectUser = Selectable<User>;
export type NewUser = Insertable<User>;
export type UserUpdate = Updateable<User>;

export type SelectKey = Selectable<Key>;
export type NewKey = Insertable<Key>;
export type KeyUpdate = Updateable<Key>;

export type SelectSession = Selectable<Session>;
export type NewSession = Insertable<Session>;
export type SessionUpdate = Updateable<Session>;

export type SelectTodo = Selectable<Todo>;
export type NewTodo = Insertable<Todo>;
export type TodoUpdate = Updateable<Todo>;

export type * from "generated/database-types";
