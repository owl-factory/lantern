import { CacheController } from "@owl-factory/cache/AbstractCacheController";
import { DataManager } from "@owl-factory/data/DataManager";
import { rest } from "@owl-factory/https/rest";
import { isOwner } from "server/logic/security";
import { CharacterDocument } from "types/documents";

// Named CharactersData instead of CharacterData because CharacterData is a globally scoped interface :(

// class $CharactersData extends CacheController<CharacterDocument> {
//   key = "character";
//   apiURL = '/api/characters'
// }

// export const CharactersData = new $CharactersData();

class CharactersDataManager extends DataManager<Partial<CharacterDocument>> {
  public readonly collection = "characters";

  constructor() {
    super();

    this.addGroup("owned-characters", isOwner);
    // TODO - campaign characters
  }

  protected async loadDocuments(refs: string[]): Promise<Partial<CharacterDocument>[]> {
    if (refs.length === 0) { return []; }
    const docs = await rest.post<{ characters: Partial<CharacterDocument>[] }>(`/api/characters`, { refs: refs });
    return docs.data.characters;
  }
}

export const CharactersData = new CharactersDataManager();
