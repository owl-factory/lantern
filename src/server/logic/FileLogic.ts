import { FileDocument, UserDocument } from "types/documents";
import { isOwner } from "./security";
import { Collection, FaunaIndex } from "src/fauna";
import { DatabaseLogic } from "./AbstractDatabaseLogic";
import * as fauna from "@owl-factory/database/integration/fauna";
import { Ref64 } from "@owl-factory/types";
import { Access, ReadFields, SetFields } from "@owl-factory/database/decorators/modifiers";
import { Create, Delete, Fetch, FetchMany, Index, Update } from "@owl-factory/database/decorators/crud";
import { FaunaIndexOptions } from "@owl-factory/database/types/fauna";
import { toRef } from "@owl-factory/database/conversion/fauna/to";
import { AssetUploadSource } from "types/enums/assetSource";
import { Auth } from "controllers/auth";
import { generateS3Filepath, generateS3Key } from "utilities/files";

const createFields = [
  "name",
  "src",
  "height",
  "width",
  "sizeInBytes",
  "source",
];

class $FileLogic extends DatabaseLogic<FileDocument> {
  public collection = Collection.Files;

  @Create("uploadFile")
  @SetFields(["name", "mimetype"])
  public async createUpload(doc: Partial<FileDocument>) {
    doc.isPending = true;
    doc.s3Key = generateS3Key();
    doc.s3Path = generateS3Filepath(Auth.user as UserDocument, doc);

    const createdDoc = await fauna.createOne<FileDocument>(this.collection, doc);
    if (createdDoc === undefined) {
      throw { code: 500, message: `The file ${doc.name} could not be reserved.`};
    }
    return createdDoc;
  }

  @Update("validateFileUpload")
  @SetFields(["*"])
  public async updateValidatedUpload(ref: Ref64, doc: Partial<FileDocument>) {
    (doc as any).isPending = null; // Set to null for deleting the 'isPending' value

    const updatedDoc = await fauna.updateOne<FileDocument>(ref, doc);
    if (updatedDoc === undefined) {
      throw `The file document "${doc.name}" could not be marked as valid`;
    }
    return updatedDoc;
  }

  /**
   * Creates a single new image document
   * @param doc The image document partial to create
   * @param doc The image document partial to create
   * @returns The new image document
   */
  public async create(method: AssetUploadSource, doc: Partial<FileDocument>): Promise<FileDocument> {
    let result: FileDocument;
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
  @ReadFields(["*"])
  @SetFields(createFields)
  public async createExternalLink(doc: Partial<FileDocument>): Promise<FileDocument> {
    const image = await fauna.createOne<FileDocument>(this.collection, doc);
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
  public async deleteOne(id: Ref64): Promise<FileDocument> {
    const image = await fauna.deleteOne<FileDocument>(id);
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
  public async findOne(id: Ref64): Promise<FileDocument> {
    const image = await fauna.findByID<FileDocument>(id);
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
  public async findManyByIDs(ids: Ref64[]): Promise<FileDocument[]> {
    const images = await fauna.findManyByIDs<FileDocument>(ids);
    return images;
  }

  /**
   * Fetches the partial images documents for any given user
   * @param options Any additional options for filtering the data retrieved from the database
   * @returns An array of image document partials
   */
  @Index("searchImagesByUser")
  @ReadFields(["*"])
  public async searchImagesByUser(userID: Ref64, options?: FaunaIndexOptions): Promise<FileDocument[]> {
    return this._searchImagesByUser(userID, options);
  }

  /**
   * Fetches the partial image documents for the current user
   * @param options Any additional options for filtering the data retrieved from the database
   * @returns An array of image document partials
   */
  @Index("searchMyImages")
  @ReadFields(["*"])
  public async searchMyImages(options?: FaunaIndexOptions): Promise<FileDocument[]> {
    const userID = Auth.user?.ref;
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
   public async updateMyImage(ref: Ref64, doc: Partial<FileDocument>) {
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
  private async _searchImagesByUser(userID: Ref64, options?: FaunaIndexOptions): Promise<FileDocument[]> {
    const ref = toRef(userID);
    const images = await fauna.searchByIndex<FileDocument>(FaunaIndex.ImagesByUser, [ref], options);
    return images;
  }
}

export const FileLogic = new $FileLogic();
