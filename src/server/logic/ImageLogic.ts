import { Expr } from "faunadb";
import { ImageDocument } from "types/documents";
import { FaunaRef } from "types/fauna";
import { CoreModelLogic } from "./CoreModelLogic";
import { query as q } from "faunadb";
import { getServerClient } from "utilities/db";
import { mapFauna } from "utilities/fauna";

const createFields = [
  "name",
  "src",
  "height",
  "width",
];

export class ImageLogic {
  /**
   * Validates the image document and saves to the database
   * @param image The image document to save to the database
   * @param myID The current user's id
   */
  public static async createExternalImage(image: ImageDocument, myID: string): Promise<ImageDocument> {
    // Validate external image
    image = CoreModelLogic.trimRestrictedFields(image, createFields);

    image.isExternal = true;
    image.sizeInBytes = 0;

    return mapFauna(await CoreModelLogic.createOne("images", myID, { data: image })) as ImageDocument;

  }

  /**
   * Deletes an image from the database and CDN (if present)
   * @param ref The image ref to delete from the database and CDN
   * @param myID The current user's id
   * @param roles The current user's roles
   */
  public static async deleteImage(ref: FaunaRef | Expr, myID: string, roles: string[]): Promise<boolean> {
    const image = await this.fetchImageByRef(ref, myID, roles);
    if (!image) { throw { code: 404, status: "The image could not be found."}; }
    return false;
  }

  /**
   * Fetches a user's images from an index
   * @param myID The current user's id
   * @param roles The roles for the current user
   */
  public static async fetchMyImages(myID: string, roles?: string[]): Promise<ImageDocument[]> {
    const images = await CoreModelLogic.fetchByIndex(
      "my_images_asc",
      [ q.Ref(q.Collection("users"), myID) ],
      ["ref", "name", "src"],
      { size: 100 }
    );
    return images;
  }

  /**
   * Fetches an image by its reference
   * @param ref The ref of the image  to fetch
   * @param myID The ID of the current user
   * @param roles The roles of the current user
   */
  public static async fetchImageByRef(
    ref: FaunaRef | Expr,
    myID: string,
    roles: string[]
  ): Promise<ImageDocument | null> {
    const client = getServerClient();
    const image = await client.query(q.Get(ref));
    if (!image) { return null; }
    // TODO - add security here
    return mapFauna(image) as ImageDocument;
  }

  /**
   * Checks if the current user can delete the image
   * @param image The image document to delete
   * @param myID The current user's id
   * @param roles The current user's roles
   */
  public static canDelete(image: ImageDocument, myID: string, roles: string[]): boolean {
    if ("admin" in roles) { return true; }
    if (myID === image.ownedBy?.id) { return true; }
    return false;
  }
}