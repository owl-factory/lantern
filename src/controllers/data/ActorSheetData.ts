import { DataManager } from "@owl-factory/data/DataManager";
import { ActorSheetDocument } from "types/documents/ActorSheet";
import { PageElementDescriptor } from "types/sheetElementDescriptors";

class ActorSheetDataManager extends DataManager<Partial<ActorSheetDocument>> {
  public collection = "actorSheets";

  constructor() {
    super("/api/actor-sheets");
  }

  /**
   * Creates a new actor sheet
   * @param actorSheet The actor sheet to create
   * @returns The created actor sheet
   */
  public async create(actorSheet: Partial<ActorSheetDocument>) {
    // TODO - validation

    const res = await this.$create(actorSheet);
    return res[0];
  }

  /**
   * Updates an actor sheet
   * @param actorSheet The actor sheet to update
   * @returns The updated actor sheet
   */
  public async update(actorSheet: Partial<ActorSheetDocument>) {
    // TODO - validation
    const res = await this.$update(actorSheet);
    return res[0];
  }
}

export const ActorSheetData = new ActorSheetDataManager();
