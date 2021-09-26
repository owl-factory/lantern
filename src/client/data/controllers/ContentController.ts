import { ContentDocument } from "types/documents";
import { ContentManager } from "../managers";
import { DataController } from "./DataController";

class $ContentController extends DataController<ContentDocument> {
}

export const ContentController = new $ContentController(ContentManager, "/api/contents");
