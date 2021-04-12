export interface Document<D> {
  data: D;
  ref: Ref;
  ts: number;
}

export interface Ref {
  "@ref": {
    id: number,
    collection: {
      "@ref": {
        id: string
      }
    },
  };
}

export interface UserData {
  email?: string;
  username?: string;
  displayName?: string;
  icon?: string;
}

export type User = Document<UserData>;

export interface Session {
  secret: string;
  user: User;
}
