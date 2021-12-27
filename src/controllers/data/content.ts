import { ContentDocument } from "types/documents";
import { DataController } from "controllers/data/DataController";
import { DataManager } from "controllers/data/DataManager";

class $ContentController extends DataController<ContentDocument> {
}

// export const ContentManager = new DataManager<ContentDocument>("my-content");
// export const ContentController = new $ContentController(ContentManager, "/api/contents");
