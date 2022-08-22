import { DataManager } from "@owl-factory/data";
import { isOwner } from "security/documents";
import { CharacterDocument } from "types/documents";

class CharactersDataManager extends DataManager<Partial<CharacterDocument>> {
  public collection = "characters";

  constructor() {
    super("/api/characters");

    this.addGroup("owned-characters", isOwner);
    // TODO - campaign characters
  }
}

export const CharactersData = new CharactersDataManager();
