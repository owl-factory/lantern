import { FileDocument, UserDocument } from "types/documents";
import { mimetypeToExtensionMap } from "types/enums/files/mimetypes";
import { v4 as uuid } from "uuid";

/**
 * Generates a key
 * @returns The randomly generated S3 key
 */
export function generateS3Key() {
  return uuid();
}

/**
 * Generates an a filepath for saving and accessing an object in S3
 * @param account The owning account
 * @param fileDoc The file document to be saved
 * @returns The generated filepath to use for accessing and saving from AWS
 */
export function generateS3Filepath(account: UserDocument, fileDoc: Partial<FileDocument>) {
  if (!fileDoc.s3Key) { throw `The AWS S3 key is required to generate an S3 filepath`; }
  if (!fileDoc.mimetype) { throw `The mimetype is required to generate an S3 filepath`; }
  return `${account.ref}/${fileDoc.s3Key}/full.${(mimetypeToExtensionMap[fileDoc.mimetype])}`;
}
