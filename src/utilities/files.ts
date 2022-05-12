import { FileDocument, UserDocument, fileExtentionMap } from "types/documents";
import { v4 as uuid } from "uuid";

/**
 * Generates a key
 * @returns The randomly generated S3 key
 */
export function generateS3Key() {
  return uuid();
}

export function generateS3Filepath(account: UserDocument, fileDoc: Partial<FileDocument>) {
  if (!fileDoc.s3Key) { throw `The AWS S3 key is required to generate an S3 filepath`; }
  if (!fileDoc.mimetype) { throw `The mimetype is required to generate an S3 filepath`; }
  return `${account.ref}/${fileDoc.s3Key}/full.${(fileExtentionMap[fileDoc.mimetype])}`;
}
