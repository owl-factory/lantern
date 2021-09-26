import { CharacterDocument } from "types/documents";
import { CharacterManager } from "../managers";
import { DataController } from "./DataController";

class $CharacterController extends DataController<CharacterDocument> {
}

export const CharacterController = new $CharacterController(CharacterManager, "/api/characters");
