import { FileDocument, UserDocument } from "types/documents";
import { Collection, FaunaIndex } from "src/fauna";
import * as fauna from "@owl-factory/database/utilities/integration/fauna";
import { Ref64 } from "@owl-factory/types";
import { Create, Delete, Fetch, Search, Update } from "@owl-factory/database/utilities/decorators/decorators";
import { FaunaIndexOptions } from "@owl-factory/database/types/fauna";
import { toRef } from "@owl-factory/database/utilities/conversion/fauna/to";
import { Auth } from "controllers/auth";
import { generateS3Filepath, generateS3Key } from "utilities/files";
import * as access from "./access";
import { FileCreateMethod } from "types/enums/files/createMethod";

const collection = Collection.Files;

class $FileLogic {
  public collection = Collection.Files;

  /**
   * Creates a pending file document in the database
   * @param doc The file document to insert into the database
   * @returns The created document
   */
  @Create(["*"], ["name", "mimetype"])
  public async createUpload(doc: Partial<FileDocument>) {
    doc.createdMethod = FileCreateMethod.Upload;
    doc.isPending = true;
    doc.s3Key = generateS3Key();
    doc.s3Path = generateS3Filepath(Auth.user as UserDocument, doc);

    const createdDoc = await fauna.createOne<FileDocument>(this.collection, doc);
    if (createdDoc === undefined) {
      throw { code: 500, message: `The file ${doc.name} could not be reserved.`};
    }
    return createdDoc;
  }

  /**
   * Updates a pending file document to be valid
   * @param ref The ref of the pending file document to mark as valid
   * @param doc The changes to the file document
   * @returns The updated file document
   */
  @Update(collection, ["*"], ["src", "mimetype", "sizeInBytes"], (ref) => access.fetch(collection, ref))
  public async updateValidatedUpload(ref: Ref64, doc: Partial<FileDocument>) {
    (doc as any).isPending = null; // Set to null for deleting the 'isPending' value
    const updatedDoc = await fauna.updateOne<FileDocument>(ref, doc);
    if (updatedDoc === undefined) {
      throw `The file document "${doc.name}" could not be marked as valid`;
    }
    return updatedDoc;
  }

  /**
   * Deletes a single image document from the database and wherever it is stored
   * @param id The ID of the image document to delete
   * @returns The deleted image document
   */
  @Delete(collection, ["*"], (ref) => access.fetch(collection, ref))
  public async delete(ref: Ref64): Promise<FileDocument> {
    return await access.remove(collection, ref);
  }

  /**
   * Fetches one image from its ID
   * @param id The Ref64 ID of the document to fetch
   * @returns The image document
   */
  @Fetch(collection, ["*"])
  public async fetch(ref: Ref64): Promise<FileDocument> {
    return await access.fetch(collection, ref);
  }

  /**
   * Fetches the partial images documents for any given user
   * @param options Any additional options for filtering the data retrieved from the database
   * @returns An array of image document partials
   */
  @Search(["*"])
  public async searchImagesByUser(userID: Ref64, options?: FaunaIndexOptions): Promise<FileDocument[]> {
    return this._searchImagesByUser(userID, options);
  }

  /**
   * Fetches the partial image documents for the current user
   * @param options Any additional options for filtering the data retrieved from the database
   * @returns An array of image document partials
   */
  @Search(["*"])
  public async searchMyImages(options?: FaunaIndexOptions): Promise<FileDocument[]> {
    const userID = Auth.user?.ref;
    if (!userID) { return []; }
    return this._searchImagesByUser(userID, options);
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
