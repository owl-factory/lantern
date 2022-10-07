import { Asset, User } from "@prisma/client";
import { Mimetype, mimetypeToExtensionMap } from "types/enums/files/mimetypes";
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
 * @param asset The file document to be saved
 * @returns The generated filepath to use for accessing and saving from AWS
 */
export function generateS3Filepath(account: User, asset: Partial<Asset>) {
  if (!asset.s3Key) { throw `The AWS S3 key is required to generate an S3 filepath`; }
  if (!asset.mimetype) { throw `The mimetype is required to generate an S3 filepath`; }
  const res = `${account.id}/${asset.s3Key}/full.${(mimetypeToExtensionMap[asset.mimetype as Mimetype])}`;
  console.log(res)
  return res;
}
