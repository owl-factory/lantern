import { Ref64 } from "types";
import { BaseDocument } from "types/documents";




/**
 * The user object for the user's core data for use with NextAuth
 */
export interface UserDocument extends BaseDocument {
  username: string;
  email: string;
  avatar: { ref: Ref64 | null; src: string; };

  // SECURITY
  role: string; // Which role a user is assigned and the default permission
  permissions: string[]; // Any additional permissions a user has on top of their role

  // STORAGE
  storageUsed: number;
  maximumAvailableStorage: number;

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
