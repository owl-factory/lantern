import { DataManager } from "@owl-factory/data/DataManager";
import { SheetController } from "controllers/layout/SheetController";
import { ActorSheetDocument } from "types/documents/ActorSheet";
import { PageElementDescriptor } from "types/sheetElementDescriptors";

class ActorSheetDataManager extends DataManager<Partial<ActorSheetDocument>> {
  public collection = "actorSheets";
  public sheet: SheetController<Partial<ActorSheetDocument>>;

  constructor() {
    super("/api/actor-sheets");
    this.sheet = new SheetController();
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

  /**
   * Loads raw XML into the sheet controller
   * @param key The key of the sheet to load into the sheet controller
   * @param xml The raw XML string to load into the sheet controller
   */
  public loadSheet(key: string, xml?: string) {
    if (xml) {
      this.sheet.load(key, xml);
      return;
    } else {
      const sheet = this.get(key);
      if (!sheet || !sheet.xml) { return;}

      this.sheet.load(key, sheet.xml);
    }
  }

  /**
   * Unloads a sheet
   * @param key The key of the sheet to unload
   */
  public unloadSheet(key: string) {
    this.sheet.unload(key);
  }

  /**
   * Finds and retusn an actor sheet
   * @param key The key of the sheet to fetch
   */
  public getSheet(key: string): PageElementDescriptor {
    return this.sheet.getSheet(key);
  }
}

export const ActorSheetData = new ActorSheetDataManager();
