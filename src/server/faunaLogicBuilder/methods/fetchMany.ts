import { DocumentReference } from "server/logic";
import { AnyDocument } from "types/documents";
import { MyUserDocument } from "types/security";
import { FunctionConfig } from "../types";
import { $fetch } from "./fetch";

/**
 * Fetches many documents at once without blocking one another
 * @param refs A list of references to documents to pull
 * @param myUser The current user attempting to pull the information about the documents
 * @param config The configuration information for the fetchMany function
 * @returns Returns a promise of a document list, with all security applied
 */
export async function $fetchMany(
  refs: (string | DocumentReference)[],
  myUser: MyUserDocument,
  config: FunctionConfig
): Promise<AnyDocument[]> {
  const docs: Promise<AnyDocument>[] = [];
  refs.forEach((ref: string | DocumentReference) => {
    const doc = $fetch(ref, myUser, config);
    if (doc === null) { return; }

    docs.push(doc as Promise<AnyDocument>);
  });

  return Promise.all(docs);
}
