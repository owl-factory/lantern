import { CacheController } from "@owl-factory/cache/AbstractCacheController";
import { DataManager } from "@owl-factory/data/AbstractDataManager";
import { rest } from "@owl-factory/https/rest";
import { isOwner } from "server/logic/security";
import { SceneDocument } from "types/documents";

class $SceneData extends CacheController<SceneDocument> {
  key = "scene";
  apiURL = '/api/scenes'
}

export const SceneData = new $SceneData();

class SceneDataManager extends DataManager<Partial<SceneDocument>> {
  public readonly collection = "scenes";

  constructor() {
    super();

    this.addGroup("owned-scenes", isOwner);
  }

  protected async loadDocuments(refs: string[]): Promise<Partial<SceneDocument>[]> {
    if (refs.length === 0) { return []; }
    const docs = await rest.post<{ scenes: Partial<SceneDocument>[] }>(`/api/scenes`, { refs: refs });
    return docs.data.scenes;
  }
}
