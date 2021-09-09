import { CampaignDocument } from "types/documents";
import { DataManager } from "./DataManager";

export const CampaignManager = new DataManager<CampaignDocument>("campaign");
