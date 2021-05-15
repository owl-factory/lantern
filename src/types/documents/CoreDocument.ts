import { UserDocument } from "types/documents";
import { FaunaRef } from "types/fauna";

export interface CoreDocument {
  id?: string;
  collection?: string
  ref?: FaunaRef;
  ts?: number;

  name?: string;
  ownedBy?: UserDocument;
  createdAt?: Date;
  createdBy?: UserDocument;
  updatedAt?: Date;
  updatedBy?: UserDocument;
}

