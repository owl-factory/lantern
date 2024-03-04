import type { Insertable, Selectable, Updateable } from "kysely";
import type { Key, Session, User, Content } from "generated/database-types";

/**
 * Dynamic data type used to represent JSON data in the database with unknown keys and values.
 * This definition is equivalent to Record\<string, string\> but with a named key.
 * Some JSON data in the database will have a known structure that may include one or more of these dynamic data fields.
 */
export type Data = { [key: string]: string };

export type SelectUser = Selectable<User>;
export type NewUser = Insertable<User>;
export type UserUpdate = Updateable<User>;

export type SelectKey = Selectable<Key>;
export type NewKey = Insertable<Key>;
export type KeyUpdate = Updateable<Key>;

export type SelectSession = Selectable<Session>;
export type NewSession = Insertable<Session>;
export type SessionUpdate = Updateable<Session>;

export type SelectContent = Selectable<Content>;
export type NewContent = Insertable<Content>;
export type ContentUpdate = Updateable<Content>;

export type * from "generated/database-types";
