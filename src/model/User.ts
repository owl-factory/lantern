export interface User {
  id?: string;
  username: string;
  displayName: string;
  hoursPlayed: number;
  membership: Membership;
}

export enum Membership {
  Free = 0,
  Premium = 1,
}
