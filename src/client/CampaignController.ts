import { makeAutoObservable } from "mobx";
import { CampaignDocument } from "types/documents";
import { rest } from "utilities/request";

/**
 * A Controller for handling and managing all things campaigns
 */
export class CampaignController {
  private controller?: unknown; // The parent controller, if any
  private campaigns: CampaignDocument[] = [];

  constructor(observe?: boolean, controller?: unknown, ) {
    this.fetchCampaigns();

    this.controller = controller;
    if (observe) { makeAutoObservable(this);}
  }

  /**
   * Returns all campaigns in the campaign controller
   */
  public getCampaigns(): CampaignDocument[] {
    return this.campaigns;
  }

  /**
   * Fetches all campaigns that a user belongs to.
   */
  public async fetchCampaigns(): Promise<void> {
    const result = await rest.get<FetchCampaignsResponse>(`/api/campaigns`);
    if (!result.success) {
      // TODO - do something
      return;
    }
    this.campaigns = result.data.campaigns;
  }

  /**
   * Creates a new campaign
   * @param values The raw form values that make up a new campaign
   */
  public async createCampaign(values: { name: string, rulesetID: string }): Promise<void> {
    const protoCampaign: CampaignDocument = {
      name: values.name,
      ruleset: {
        id: values.rulesetID,
      },
    };

    const result = await rest.put<CreateCampaignResponse>(`/api/campaigns`, protoCampaign as Record<string, unknown>);
    if (!result.success) {
      // TODO - do something
      return;
    }
    this.campaigns.splice(0, 0, result.data.campaign);
  }
}

interface FetchCampaignsResponse {
  campaigns: CampaignDocument[];
}

interface CreateCampaignResponse {
  campaign: CampaignDocument;
}
