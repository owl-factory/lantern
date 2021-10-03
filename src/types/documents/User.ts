import { CoreDocument } from "types/documents";
import { ImageDocument } from "./assets";

interface PartialImageDocument extends Partial<ImageDocument> {
  id: string;
  src: string;
}


/**
 * The user object for the user's core data for use with NextAuth
 */
export interface UserDocument extends CoreDocument {
  username: string;
  email: string;
  displayName?: string;
  avatar: PartialImageDocument;

  roles?: string[];

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
