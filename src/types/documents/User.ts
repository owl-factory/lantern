import { CoreDocument } from "types/documents";

/**
 * The user object for the user's core data for use with NextAuth
 */
export interface UserDocument extends CoreDocument {
  username?: string;
  email?: string;
  displayName?: string;
  icon?: string;

  roles?: string[];

  achievements?: {
    earnedAt?: Date;
    achievement: any;
  }[];
  bio?: string;
  enjoysPlaying: string[];
  isPrivate?: boolean;

  hoursPlayed?: number;
  
}
