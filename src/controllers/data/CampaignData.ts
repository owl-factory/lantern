import { DataManager } from "@owl-factory/data/DataManager";
import { getUniques } from "@owl-factory/utilities/arrays";
import { Auth } from "controllers/auth";
import { isOwner } from "security/documents";
import { CampaignDocument } from "types/documents";

class CampaignDataManager extends DataManager<Partial<CampaignDocument>> {
  public collection = "campaigns";

  constructor() {
    super("/api/campaigns");

    this.addGroup("owned-campaigns", isOwner);
    this.addGroup("my-campaigns", isMyCampaign);
  }

  /**
   * Searches for the current user's campaigns
   */
  public searchMyCampaigns() {
    this.searchIndex("/api/my-campaigns");
  }
}

/**
 * Evaluates a campaign document to determine if the current user is a player in this campaign
 * TODO - move to a campaign helper document
 * @param doc The document to evaluate
 * @returns True if the user belongs to a campaign. False otherwise
 */
function isMyCampaign(doc: Partial<CampaignDocument> | undefined): boolean {
  if (!doc || !Auth.isLoggedIn) { return false; }

  if (isOwner(doc)) { return true; }
  else if (doc.players === undefined || Auth.ref === undefined) { return false; }

  const players = getUniques(doc.players, "ref");
  if (players.includes(Auth.ref)) {
    return true;
  }

  return false;
}

export const CampaignData = new CampaignDataManager();
