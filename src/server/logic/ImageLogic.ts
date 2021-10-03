import { AnyDocument, ImageDocument } from "types/documents";
import { FaunaLogicBuilder } from "server/faunaLogicBuilder/FaunaLogicBuilder";
import { isOwner } from "./security";
import { MyUserDocument } from "types/security";
import { myUserToTerm } from "./CoreModelLogic";
import { AssetSource, AssetUploadSource } from "types/enums/assetSource";

const createFields = [
  "name",
  "src",
  "height",
  "width",
  "sizeInBytes",
  "source",
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
  .create("createExternalLink")
    .roles()
      .user(true)
    .done()
    .setFields()
      .user(createFields.concat([]))
    .done()
    .preProcess(createExternalPreprocess)
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
   * Initializes the fetch many function. Everything is inherited from globals
   */
   .fetchMany()
   .done()

  /**
   * Allows for searching through a users images in order of most recently created to oldest
   */
  .search("fetchMyImages", "my_images_asc")
    .preProcessTerms(myUserToTerm)
    .indexFields(["ref", "name", "src"])
  .done()
.done()).export();

/**
 * Creates a new image in the given method. Supercedes the generic 'create' function
 * @param image The image document to create
 * @param method The method by which the image is being created
 * @param myUser The user attempting to create this image
 * @returns The created image document
 */
ImageLogic.create = async (image: Partial<ImageDocument>, method: AssetUploadSource, myUser: MyUserDocument) => {
  let result: unknown;
  switch(method) {
    case AssetUploadSource.Select:
      if (!image.id) { throw {code: 500, message: "An image ID is required for the Select create method." }; }
      result = await ImageLogic.fetch(image.id, myUser);
      if (!result) { throw { code: 404, message: "Image not found."}; }
      return result;

    case AssetUploadSource.ExternalLink:
      result = await ImageLogic.createExternalLink(image);
      return result;

    case AssetUploadSource.InternalLink:
    case AssetUploadSource.Purchased:
    case AssetUploadSource.Upload:
    case AssetUploadSource.Created:
      throw { code: 501, message: "This method is not currently implemented." };

    default:
      throw { code: 400, message: "This creation method is not allowed." };
  }
};


/**
 * Adds fields marking this image document as an external image.
 * TODO - allow for setting an image as 'pixiLoadable', as some are and some are not
 * @param doc The image document that is being prepared for creation
 * @param myUser The current user creating this document
 * @returns Returns an updated document
 */
function createExternalPreprocess(doc: AnyDocument, _: MyUserDocument) {
  const updatedDoc = doc as ImageDocument;
  updatedDoc.source = AssetSource.ExternalLink;
  updatedDoc.sizeInBytes = 0;

  return doc;
}
