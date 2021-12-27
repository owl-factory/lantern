import { CharacterDocument } from "types/documents";
import { DataController } from "controllers/data/DataController";
import { DataManager } from "controllers/data/DataManager";

class $CharacterController extends DataController<CharacterDocument> {
}

// export const CharacterManager = new DataManager<CharacterDocument>("character");
// export const CharacterController = new $CharacterController(CharacterManager, "/api/characters");
