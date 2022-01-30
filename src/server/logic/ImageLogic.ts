import { ImageDocument } from "types/documents";
import { isOwner } from "./security";
import { UserRole } from "@owl-factory/auth/enums";
import { Collection, FaunaIndex } from "src/fauna";
import { DatabaseLogic } from "./AbstractDatabaseLogic";
import * as fauna from "@owl-factory/database/integration/fauna";
import { Ref64 } from "@owl-factory/types";
import { Access, ReadFields, SetFields } from "@owl-factory/database/decorators/modifiers";
import { Create, Delete, Fetch, FetchMany, Index, Update } from "@owl-factory/database/decorators/crud";
import { FaunaIndexOptions } from "@owl-factory/database/types/fauna";
import { SecurityController } from "controllers/SecurityController";
import { toRef } from "@owl-factory/database/conversion/fauna/to";
import { AssetUploadSource } from "types/enums/assetSource";

const createFields = [
  "name",
  "src",
  "height",
  "width",
  "sizeInBytes",
  "source",
];

class $ImageLogic extends DatabaseLogic<ImageDocument> {
  public collection = Collection.Images;

  /**
   * Creates a single new image document
   * @param doc The image document partial to create
   * @param doc The image document partial to create
   * @returns The new image document
   */
  public async create(method: AssetUploadSource, doc: Partial<ImageDocument>): Promise<ImageDocument> {
    let result: ImageDocument;
    switch(method) {
      case AssetUploadSource.Select:
        if (!doc.ref) { throw {code: 500, message: "An image ID is required for the Select create method." }; }
        result = await this.findOne(doc.ref);
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

  /**
   * Creates a single new image document linking to an external image
   * @param doc The image document partial to create
   * @returns The new image document
   */
  @Create("createExternalImage")
  @Access({[UserRole.User]: true})
  @ReadFields(["*"])
  @SetFields(createFields)
  public async createExternalLink(doc: Partial<ImageDocument>): Promise<ImageDocument> {
    const image = await fauna.createOne<ImageDocument>(this.collection, doc);
    if (image === undefined) { throw { code: 500, message: "An unexpected error occured while creating the image"}; }
    return image;
  }

  /**
   * Deletes a single image document from the database and wherever it is stored
   * @param id The ID of the image document to delete
   * @returns The deleted image document
   */
  @Delete("deleteMyImage")
  @Access(isOwner)
  @ReadFields(["*"])
  public async deleteOne(id: Ref64): Promise<ImageDocument> {
    const image = await fauna.deleteOne<ImageDocument>(id);
    if (image === undefined) { throw {code: 500, message: "An unexpected error occured while deleting the document"}; }
    return image;
  }

  /**
   * Fetches one image from its ID
   * @param id The Ref64 ID of the document to fetch
   * @returns The image document
   */
  @Fetch("viewAnyImage")
  @ReadFields(["*"])
  public async findOne(id: Ref64): Promise<ImageDocument> {
    const image = await fauna.findByID<ImageDocument>(id);
    if (image === undefined) { throw { code: 404, message: `The image with id ${id} could not be found.`}; }
    return image;
  }

  /**
   * Fetches many images from their IDs
   * @param ids The Ref64 IDs of the documents to fetch
   * @returns The found and allowed image documents
   */
  @FetchMany("viewAnyImage")
  @ReadFields(["*"])
  public async findManyByIDs(ids: Ref64[]): Promise<ImageDocument[]> {
    const images = await fauna.findManyByIDs<ImageDocument>(ids);
    return images;
  }

  /**
   * Fetches the partial images documents for any given user
   * @param options Any additional options for filtering the data retrieved from the database
   * @returns An array of image document partials
   */
  @Index("searchImagesByUser")
  @Access({[UserRole.Admin]: true})
  @ReadFields(["*"])
  public async searchImagesByUser(userID: Ref64, options?: FaunaIndexOptions): Promise<ImageDocument[]> {
    return this._searchImagesByUser(userID, options);
  }

  /**
   * Fetches the partial image documents for the current user
   * @param options Any additional options for filtering the data retrieved from the database
   * @returns An array of image document partials
   */
  @Index("searchMyImages")
  @ReadFields(["*"])
  public async searchMyImages(options?: FaunaIndexOptions): Promise<ImageDocument[]> {
    const userID = SecurityController.currentUser?.ref;
    if (!userID) { return []; }
    return this._searchImagesByUser(userID, options);
  }

  /**
   * Updates a single document
   * @param ref The ref of the document to update
   * @param doc The changes in the document to patch on
   * @returns The updated document
   */
   @Update("updateMyImage")
   @Access(isOwner)
   @ReadFields(["*"])
   @SetFields(["*"])
   public async updateMyImage(ref: Ref64, doc: Partial<ImageDocument>) {
    const updatedDoc = await fauna.updateOne(ref, doc);
    // TODO - better message
    if (updatedDoc === undefined) {
      throw { code: 404, message: `The image document with id ${ref} could not be found.`};
    }
    return updatedDoc;
  }

  /**
   * Fetches the partial image documents for any given user for the images by user and my images functions
   * @param options Any additional options for filtering the data retrieved from the database
   * @returns An array of campaign document partials
   */
  private async _searchImagesByUser(userID: Ref64, options?: FaunaIndexOptions): Promise<ImageDocument[]> {
    const ref = toRef(userID);
    const images = await fauna.searchByIndex<ImageDocument>(FaunaIndex.ImagesByUser, [ref], options);
    return images;
  }
}

export const ImageLogic = new $ImageLogic();
