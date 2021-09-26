import { ImageDocument } from "types/documents";
import { ImageManager } from "../managers";
import { DataController } from "./DataController";

class $ImageController extends DataController<ImageDocument> {
}

export const ImageController = new $ImageController(ImageManager, "/api/images");
