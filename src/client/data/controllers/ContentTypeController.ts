import { ContentTypeDocument } from "types/documents";
import { ContentTypeManager } from "../managers";
import { DataController } from "./DataController";

class $ContentTypeController extends DataController<ContentTypeDocument> {
}

export const ContentTypeController = new $ContentTypeController(ContentTypeManager, "/api/content-types");
