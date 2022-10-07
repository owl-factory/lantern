import { Asset } from "@prisma/client";
import { Mimetype } from "types/enums/files/mimetypes";

const MAXIMUM_SIZE_IN_BYTES = 5 * 1024 * 1024; // 5MB is the limit

/**
 * Validates a raw and uploaded file
 * @param file The raw, uploaded file to validate
 * @throws Errors if an issue is found with the type of file being uploaded
 */
export function validateRawFile(file: File | null) {
  if (!file) { throw "You must select a file to upload."; }
  if (!isValidMimetype(file.type)) { throw `The extension ${file.name.replace(/^.*?\./, ".")} is not allowed`}
  if (file.size > MAXIMUM_SIZE_IN_BYTES) { throw `The file ${file.name} is too large to be uploaded`; }
  return;
}

/**
 * Validates a file document describing an upload before it is created
 * @todo Implement in a validation project
 * @param doc The creating file upload document to validate
 */
export function validateAssetUploadCreationDoc(doc: Partial<Asset>) {
  return;
}

export function validateFileType(type: string) {
  return;
}

/**
 * Checks if the given mimetype is an allowed type
 * @param mimetype The mimetype to validate
 * @returns True if the mimetype is valid. False if not
 */
export function isValidMimetype(mimetype: string): boolean {
  return (Object.values(Mimetype) as string[]).includes(mimetype.toLowerCase());
}
