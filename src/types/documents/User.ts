import { Ref64 } from "@owl-factory/types";
import { CoreDocument } from "types/documents";
import { UserRole } from "@owl-factory/auth/enums";
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
  avatar: { ref: Ref64; src: string; };

  role: UserRole;

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
