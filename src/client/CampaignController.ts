import { makeAutoObservable } from "mobx";
import { CampaignDocument } from "types/documents";

/**
 * A Controller for handling and managing all things campaigns
 */
export class CampaignController {
  private controller?: unknown; // The parent controller, if any
  private campaigns: CampaignDocument[] = [
    {
      name: "Endless Sea",
      banner: {
        src: "https://s3.amazonaws.com/files.d20.io/images/28158341/Wi_S7vricybqh26bZNOz7w/max.jpg?1485839366628",
      },
      lastPlayed: new Date()
    }
  ];

  constructor(observe?: boolean, controller?: unknown, ) {
    this.controller = controller;
    if (observe) { makeAutoObservable(this);}
  }

  /**
   * Returns all campaigns in the campaign controller
   */
  public getCampaigns(): CampaignDocument[] {
    return this.campaigns;
  }

  public createCampaign(values: { name: string, gameSystemID: string }): void {

  }
}