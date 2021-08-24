import { ImageDocument } from "types/documents";
import { FaunaLogicBuilder } from "server/faunaLogicBuilder/FaunaLogicBuilder";
import { isOwner } from "./security";
import { MyUserDocument } from "types/security";

const createFields = [
  "name",
  "src",
  "height",
  "width",
];

export const ImageLogic = (new FaunaLogicBuilder("images")
  // Globals
  .fields()
    .guest([])
    .user(["*"])
    .admin(["*"])
  .done()
  .roles()
    .guest(false)
    .user(true)
    .admin(true)
  .done()

  /**
   * Creates a link to an external image
   */
  .create("createExternalImage")
    .roles()
      .user(true)
    .done()
    .setFields()
      .user(createFields.concat(["isExternal", "sizeInBytes"]))
    .done()
    .preProcess(createExternalImagePreprocess)
  .done()

  /**
   * Allows an owner or admin to delete an image.
   * TODO - different delete functions for different kinds of images
   */
  .delete()
    .roles()
      .user(isOwner)
      .admin(true)
    .done()
  .done()

  /**
   * Initializes the fetch function. Everything is inherited from globals
   */
  .fetch()
  .done()

  /**
   * Allows for searching through a users images in order of most recently created to oldest
   */
  .search("fetchMyImages", "my_images_asc")
    .indexFields(["ref", "name", "src"])
  .done()
.done()).export();

/**
 * Adds fields marking this image document as an external image.
 * TODO - change 'isExternal' to an enum for different types.
 * TODO - allow for setting an image as 'pixiLoadable', as some are and some are not
 * @param doc The image document that is being prepared for creation
 * @param myUser The current user creating this document
 * @returns Returns an updated document
 */
function createExternalImagePreprocess(doc: ImageDocument, myUser: MyUserDocument) {
  doc.isExternal = true;
  doc.sizeInBytes = 0;

  return doc;
}
