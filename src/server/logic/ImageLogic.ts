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
  public static async createExternalImage(image: ImageDocument, myID: string): Promise<ImageDocument> {
    // Validate external image
    image = CoreModelLogic.trimRestrictedFields(image, createFields);

    image.isExternal = true;
    image.sizeInBytes = 0;

    return mapFauna(await CoreModelLogic.createOne("images", myID, { data: image })) as ImageDocument;

  }

  public static async deleteImage(ref: FaunaRef | Expr, myID: string, roles: string[]): Promise<boolean> {
    const image = await this.fetchImageByRef(ref, myID, roles);
    if (!image) { throw { code: 404, status: "The image could not be found."}; }
    
  }

  public static async fetchMyImages(myID: string, roles?: string[]): Promise<ImageDocument[]> {
    const images = await CoreModelLogic.fetchByIndex(
      "my_images",
      [ q.Ref(q.Collection("users"), myID) ],
      ["ref", "name", "src"],
      { size: 100 }
    );
    return images;
  }

  public static async fetchImageByRef(ref: FaunaRef | Expr, myID: string, roles: string[]) {
    const client = getServerClient();
    const image = await client.query(q.Get(ref));
    if (!image) { return null; }
  }

  public static canDelete(image: ImageDocument, myID: string, roles: string[]): boolean {
    if ("admin" in roles) { return true; }
    if (myID === image.ownedBy?.id) { return true; }
    return false;
  }
}