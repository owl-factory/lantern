import { Ref64 } from "@owl-factory/types";
import { BaseDocument } from "types/documents";




/**
 * The user object for the user's core data for use with NextAuth
 */
export interface UserDocument extends BaseDocument {
  username: string;
  email: string;
  avatar: { ref: Ref64 | null; src: string | null; };

  // SECURITY
  role: string; // Which role a user is assigned and the default permission
  permissions: string[]; // Any additional permissions a user has on top of their role

  recentPlayers: UserDocument[];

  badges: {
    earnedAt?: Date;
    badge: any;
  }[];
  bio?: string;
  enjoysPlaying?: string[];
  activelySeeking?: string[];
  isPrivate?: boolean;

  hoursPlayed?: number;
}
