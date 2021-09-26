import { CampaignDocument } from "types/documents";
import { CampaignManager } from "../managers";
import { DataController } from "./DataController";

class $CampaignController extends DataController<CampaignDocument> {
}

export const CampaignController = new $CampaignController(CampaignManager, "/api/campaigns");
