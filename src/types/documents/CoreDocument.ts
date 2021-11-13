import { FaunaRef } from "types/fauna";

interface DocumentReference extends Partial<CoreDocument> {
  id: string;
  collection: string;
}

export interface CoreDocument {
  id: string;
  collection?: string; // Deprecated. Will be removed with the database changes
  ref?: any; // Deprecated. Will be removed with the database changes
  ts?: number;

  name?: string;
  ownedBy?: DocumentReference;
  createdAt?: Date;
  createdBy?: DocumentReference;
  updatedAt?: Date;
  updatedBy?: DocumentReference;
}

