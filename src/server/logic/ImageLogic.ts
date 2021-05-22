import { ImageDocument } from "types/documents";
import { CoreModelLogic } from "./CoreModelLogic";

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

    return await CoreModelLogic.createOne("images", myID, { data: image });

  }
}