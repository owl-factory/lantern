import { ConversionMap } from "@owl-factory/database/postgres";
import { Ref64, UUID } from "@owl-factory/types";
import { DataType } from "ts-postgres";
import { BaseDocument, BaseDocumentV2 } from "types/documents";

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

// Describes the user in a format compatible with Postgres
// TODO - break up into two documents; a public user document and a document containing more secure information,
// like emails and password hashes
export interface UserDocumentV2 extends BaseDocumentV2 {
  id: UUID; // The primary key of the user
  username: string; // The user's username used for logging in and accessing their profile
  display_name: string; // The name publicly displayed to the world
  email: string; // The user's email for logging in and contact
  password: string; // The hashed user password
}

// Maps the UserDocument to the field typing in the database
export const UserConversionMap: ConversionMap<UserDocumentV2> = {
  id: DataType.Uuid,
  username: DataType.Text,
  display_name: DataType.Text,
  email: DataType.Text,
  password: DataType.Text,
};
