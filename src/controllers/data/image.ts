import { ImageDocument } from "types/documents";
import { DataController } from "controllers/data/DataController";
import { DataManager } from "controllers/data/DataManager";

class $ImageController extends DataController<ImageDocument> {
}

export const ImageManager = new DataManager<ImageDocument>("image");
export const ImageController = new $ImageController(ImageManager, "/api/images");
