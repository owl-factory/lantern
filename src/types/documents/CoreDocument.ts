import { FaunaRef } from "types/fauna";

interface DocumentReference extends Partial<CoreDocument> {
  id: string;
  collection: string;
}

export interface CoreDocument {
  id: string;
  collection?: string
  ref?: FaunaRef;
  ts?: number;

  name?: string;
  ownedBy?: DocumentReference;
  createdAt?: Date;
  createdBy?: DocumentReference;
  updatedAt?: Date;
  updatedBy?: DocumentReference;
}

