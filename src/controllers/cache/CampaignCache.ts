import { CacheController } from "@owl-factory/cache/AbstractCacheController";
import { CampaignDocument } from "types/documents";

class $CampaignCache extends CacheController<CampaignDocument> {
  key = "campaign";
  apiURL = '/api/campaigns'
}

export const CampaignCache = new $CampaignCache();

