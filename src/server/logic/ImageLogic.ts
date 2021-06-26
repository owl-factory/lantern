import { Expr } from "faunadb";
import { ImageDocument } from "types/documents";
import { CoreModelLogic } from "server/logic";
import { DocumentReference, MyUserDocument, PaginationOptions } from "./CoreModelLogic";

const createFields = [
  "name",
  "src",
  "height",
  "width",
];

/**
 * Fetches a single image from the database.
 * @param ref The reference of the document to fetch
 * @param myUser The current user
 */
export async function fetchImage(ref: DocumentReference, myUser: MyUserDocument): Promise<ImageDocument | null> {
  const image = CoreModelLogic.fetchByRef(ref);
  // TODO - security
  return image;
}

/**
 * Fetches a collection of the current user's images
 * @param myUser The user to fetch images for
 * @param options The pagination options
 */
export async function fetchMyImages(myUser: MyUserDocument, options: PaginationOptions): Promise<ImageDocument[]> {
  if (!options.size) { options.size = 100; }
  const images = await CoreModelLogic.fetchByIndex(
    "my_images_asc",
    [ myUser.ref as Expr ],
    ["ref", "name", "src"],
    options
  );
  return images;
}

/**
 * Creates an image by way of a given method.
 * @param image The image to create/upload
 * @param method The method by which to create an image. Currently "link" and "upload".
 * @param myUser The current user attempting to create this image
 */
export async function createImageFromMethod(image: ImageDocument, method: string, myUser: MyUserDocument): Promise<ImageDocument> {
  switch(method) {
    case "link":
      return await createExternalImage(image, myUser);
    case "upload": 
      throw {code: 405, message: "Upload method not implemented"}
    default:
      throw {code: 405, message: "Method not supported"}
  }
}

/**
 * Creates an image that is linked from an external source
 * @param image The image to create
 * @param myUser The current user attempting to create an image
 */
export async function createExternalImage(image: ImageDocument, myUser: MyUserDocument): Promise<ImageDocument> {
  const fields = createFields.concat(["isExternal", "sizeInBytes"]);
  image.isExternal = true;
  image.sizeInBytes = 0;
  return await CoreModelLogic.createOne("images", image, fields, myUser);
}

/**
 * Deletes an image from the database and the CDN, if needed
 * @param ref The reference to the document to delete
 * @param myUser The current user attempting to delete an image
 */
export async function deleteImage(ref: DocumentReference, myUser: MyUserDocument): Promise<boolean> {
  // TODO - handle uploaded image case
  return await CoreModelLogic.deleteOne(ref, myUser, canDelete);
}

/**
 * Checks if the current user can delete the image
 * @param image The image document that the user may be able to delete
 * @param myUser The current user
 */
export function canDelete(image: ImageDocument, myUser: MyUserDocument): boolean {
  if ("admin" in myUser.roles) { return true; }
  if (myUser.id === image.ownedBy?.id) { return true; }
  return false;
}
