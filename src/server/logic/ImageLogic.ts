import { AnyDocument, ImageDocument } from "types/documents";
import { FaunaLogicBuilder } from "server/faunaLogicBuilder/FaunaLogicBuilder";
import { isOwner, isOwner_old } from "./security";
import { MyUserDocument, UserRole } from "types/security";
import { myUserToTerm } from "./CoreModelLogic";
import { AssetSource, AssetUploadSource } from "types/enums/assetSource";
import { Collection, FaunaIndex } from "fauna";
import { DatabaseLogic } from "./AbstractDatabaseLogic";
import * as fauna from "database/integration/fauna";
import { Ref64 } from "types";
import { Access, ReadFields, SetFields } from "database/decorators/modifiers";
import { Create, Delete, Fetch, FetchMany, Index } from "database/decorators/crud";
import { FaunaIndexOptions } from "types/fauna";
import { SecurityController } from "controllers/security";

const createFields = [
  "name",
  "src",
  "height",
  "width",
  "sizeInBytes",
  "source",
];

class $ImageLogic implements DatabaseLogic<ImageDocument> {
  public collection = Collection.Images;

  public async create(method: AssetUploadSource, doc: Partial<ImageDocument>): Promise<ImageDocument> {
    let result: ImageDocument;
    switch(method) {
      case AssetUploadSource.Select:
        if (!doc.id) { throw {code: 500, message: "An image ID is required for the Select create method." }; }
        result = await this.findByID(doc.id);
        if (!result) { throw { code: 404, message: "Image not found."}; }
        return result;

      case AssetUploadSource.ExternalLink:
        result = await this.createExternalLink(doc);
        return result;

      case AssetUploadSource.InternalLink:
      case AssetUploadSource.Purchased:
      case AssetUploadSource.Upload:
      case AssetUploadSource.Created:
        throw { code: 501, message: "This method is not currently implemented." };

      default:
        throw { code: 400, message: "This creation method is not allowed." };
    }
  }

  @Create
  @Access({[UserRole.User]: true})
  @ReadFields(["*"])
  @SetFields(createFields)
  public async createExternalLink(doc: Partial<ImageDocument>): Promise<ImageDocument> {
    const image = await fauna.createOne<ImageDocument>(this.collection, doc);
    if (image === undefined) { throw { code: 500, message: "An unexpected error occured while creating the image"}; }
    return image;
  }

  @Delete
  @Access({[UserRole.User]: isOwner, [UserRole.Admin]: true})
  @ReadFields(["*"])
  public async deleteOne(id: Ref64): Promise<ImageDocument> {
    const image = await fauna.deleteOne<ImageDocument>(id);
    if (image === undefined) { throw {code: 500, message: "An unexpected error occured while deleting the document"}; }
    return image;
  }

  @Fetch
  @Access({[UserRole.User]: true})
  @ReadFields(["*"])
  public async findByID(id: Ref64): Promise<ImageDocument> {
    const image = await fauna.findByID<ImageDocument>(id);
    if (image === undefined) { throw { code: 404, message: `The image with id ${id} could not be found.`}; }
    return image;
  }

  @FetchMany
  @Access({[UserRole.User]: true})
  @ReadFields(["*"])
  public async findManyByIDs(ids: Ref64[]): Promise<ImageDocument[]> {
    const images = await fauna.findManyByIDs<ImageDocument>(ids);
    return images;
  }

  @Index
  @Access({[UserRole.Admin]: true})
  @ReadFields(["*"])
  public async searchImagesByUser(userID: Ref64, options?: FaunaIndexOptions): Promise<ImageDocument[]> {
    return this._searchImagesByUser(userID, options);
  }

  @Index
  @Access({[UserRole.User]: true})
  @ReadFields(["*"])
  public async searchMyImages(options?: FaunaIndexOptions): Promise<ImageDocument[]> {
    const userID = SecurityController.currentUser?.id;
    if (!userID) { return []; }
    return this._searchImagesByUser(userID, options);
  }

  private async _searchImagesByUser(userID: Ref64, options?: FaunaIndexOptions): Promise<ImageDocument[]> {
    const characters = await fauna.searchByIndex<ImageDocument>(FaunaIndex.ImagesByUser, [userID], options);
    return characters;
  }
}

export const ImageLogic = new $ImageLogic();

const ImageLogic2 = (new FaunaLogicBuilder("images")
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
      .user(isOwner_old)
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
