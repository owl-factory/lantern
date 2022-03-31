import { DataManager } from "@owl-factory/data/DataManager";
import { isOwner } from "security/documents";
import { SceneDocument } from "types/documents";

class SceneDataManager extends DataManager<Partial<SceneDocument>> {
  public collection = "scenes";

  constructor() {
    super("/api/scenes");

    this.addGroup("owned-scenes", isOwner);
  }
}

export const SceneData = new SceneDataManager();
