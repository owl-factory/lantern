import { DataManager } from "@owl-factory/data/DataManager";
import { Collection } from "fauna";
import { ActorDocument } from "types/documents/Actor";

class ActorDataManager extends DataManager<Partial<ActorDocument>> {
  public collection = Collection.Actors;

  constructor() {
    super("/api/actors");
  }
}

export const ActorData = new ActorDataManager();
