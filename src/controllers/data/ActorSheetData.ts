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
   * Finds and retusn an actor sheet
   * @param key The key of the sheet to fetch
   */
  public getSheet(key: string): PageElementDescriptor {
    return this.sheet.getSheet(key);
  }
}

export const ActorSheetData = new ActorSheetDataManager();
