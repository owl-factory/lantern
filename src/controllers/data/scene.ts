import { SceneDocument } from "types/documents";
import { DataController } from "controllers/data/DataController";
import { DataManager } from "controllers/data/DataManager";

class $SceneController extends DataController<SceneDocument> {
}

export const SceneManager = new DataManager<SceneDocument>("Scene");
export const SceneDataController = new $SceneController(SceneManager, "/api/scenes");
