import { CharacterDocument } from "types/documents";
import { rest } from "utilities/request";
import { DataManager } from "./DataManager";

export const CharacterManager = new DataManager<CharacterDocument>(
  "character"
);
