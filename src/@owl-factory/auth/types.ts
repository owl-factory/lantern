/**
 * A Permission object, informing what the permission allows and what group it is apart of
 */
export interface Permission {
  key: string;
  name: string;
  collection: string;
}

export interface Role {
  key: string;
  name: string;
  permissions: string[];
}

// An expected response from a log in action, be it sign up or sign in
export interface LogInResponse<T> {
  user: T;
  permissions: string;
  jwt: string | undefined;
}
