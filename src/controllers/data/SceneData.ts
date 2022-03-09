import { DataManager } from "@owl-factory/data/DataManager";
import { rest } from "@owl-factory/https/rest";
import { isOwner } from "server/logic/security";
import { SceneDocument } from "types/documents";

class SceneDataManager extends DataManager<Partial<SceneDocument>> {
  public collection = "scenes";

  constructor() {
    super();

    this.addGroup("owned-scenes", isOwner);
  }

  public async loadDocuments(refs: string[]): Promise<Partial<SceneDocument>[]> {
    if (refs.length === 0) { return []; }
    const docs = await rest.post<{ scenes: Partial<SceneDocument>[] }>(`/api/scenes`, { refs: refs });
    return docs.data.scenes;
  }
}

export const SceneData = new SceneDataManager();
