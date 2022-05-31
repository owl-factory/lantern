import { Cacheable } from "@owl-factory/cache/decorators";
import { DataManager } from "@owl-factory/data/DataManager";
import { getUniques } from "@owl-factory/utilities/arrays";
import { Auth } from "controllers/auth";
import { SheetController } from "controllers/layout/SheetController";
import { isOwner } from "security/documents";
import { CampaignDocument } from "types/documents";
import { ActorSheetDocument } from "types/documents/ActorSheet";

class ActorSheetDataManager extends DataManager<Partial<ActorSheetDocument>> {
  public collection = "actorSheets";
  public sheet: SheetController<Partial<ActorSheetDocument>>;

  constructor() {
    super("/api/actor-sheets");
    this.sheet = new SheetController();
  }

  public loadSheet(key: string, xml?: string) {
    if (xml) {
      this.sheet.load(key, xml);
      return;
    }
  }

  public getTabs(key: string) {
    return this.sheet.getTabs(key);
  }

  public getPage(key: string, index: number) {
    return this.sheet.getPage(key, index);
  }
}

export const ActorSheetData = new ActorSheetDataManager();
