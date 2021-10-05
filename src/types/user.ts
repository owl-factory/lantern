export interface Document<D> {
  id: string | undefined;
  data: D;
  ref: Ref;
  ts: number;
}

export interface Ref {
  "@ref"?: {
    id: string,
    collection: {
      "@ref": {
        id: string
      }
    },
  };
  id?: string
}

export interface UserData {
  email?: string;
  username?: string;
  name?: string;
  icon?: string;
}

export type User = Document<UserData>;

export interface Session {
  secret: string;
  user: User;
}
