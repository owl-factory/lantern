import { FaunaRef } from "types/fauna";

interface IdCollectionRef {
  id: string;
  collection: string;
}

interface RefRef {
  ref: FaunaRef;
}

export type DocumentReference = IdCollectionRef |& RefRef;
