import { CharacterDocument } from "types/documents";
import { DataManager } from "./DataManager";

export const CharacterManager = new DataManager<CharacterDocument>("character");
