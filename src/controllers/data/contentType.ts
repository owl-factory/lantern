import { ContentTypeDocument } from "types/documents";
import { DataController } from "controllers/data/DataController";
import { DataManager } from "controllers/data/DataManager";

class $ContentTypeController extends DataController<ContentTypeDocument> {
}

// export const ContentTypeManager = new DataManager<ContentTypeDocument>("contentType");
// export const ContentTypeController = new $ContentTypeController(ContentTypeManager, "/api/content-types");
