import { DataManager } from "@owl-factory/data";
import { isOwner } from "security/documents";
import { SceneDocument } from "types/documents";

// Manages data for Scene Documents
class SceneDataManager extends DataManager<Partial<SceneDocument>> {
  public collection = "scenes";

  constructor() {
    super("/api/scenes");

    this.addGroup("owned-scenes", isOwner);
  }
}

export const SceneData = new SceneDataManager();
