import { ImageDocument } from "types/documents";
import { Collection, FaunaIndex } from "src/fauna";
import { DatabaseLogic } from "./AbstractDatabaseLogic";
import * as fauna from "@owl-factory/database/integration/fauna";
import { Ref64 } from "@owl-factory/types";
import { Access, ReadFields, SetFields } from "@owl-factory/database/decorators/modifiers";
import { Create, Delete, Fetch, FetchMany, Search, Update } from "@owl-factory/database/decorators/decorators";
import { FaunaIndexOptions } from "@owl-factory/database/types/fauna";
import { toRef } from "@owl-factory/database/conversion/fauna/to";
import { Auth } from "controllers/auth";
import { isOwner } from "security/documents";

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
   * Deletes a single image document from the database and wherever it is stored
   * @param id The ID of the image document to delete
   * @returns The deleted image document
   */
  @Delete("deleteMyImage")
  @Access(isOwner)
  @ReadFields(["*"])
  public async deleteOne(ref: Ref64): Promise<ImageDocument> {
    return await super.delete(ref);
  }

  /**
   * Fetches one image from its ID
   * @param id The Ref64 ID of the document to fetch
   * @returns The image document
   */
  @Fetch("viewAnyImage")
  @ReadFields(["*"])
  public async fetch(ref: Ref64): Promise<ImageDocument> {
    return await super.fetch(ref);
  }

  /**
   * Fetches the partial images documents for any given user
   * @param options Any additional options for filtering the data retrieved from the database
   * @returns An array of image document partials
   */
  @Search("searchImagesByUser")
  @ReadFields(["*"])
  public async searchImagesByUser(userID: Ref64, options?: FaunaIndexOptions): Promise<ImageDocument[]> {
    return this._searchImagesByUser(userID, options);
  }

  /**
   * Fetches the partial image documents for the current user
   * @param options Any additional options for filtering the data retrieved from the database
   * @returns An array of image document partials
   */
  @Search("searchMyImages")
  @ReadFields(["*"])
  public async searchMyImages(options?: FaunaIndexOptions): Promise<ImageDocument[]> {
    const userID = Auth.user?.ref;
    if (!userID) { return []; }
    return this._searchImagesByUser(userID, options);
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
