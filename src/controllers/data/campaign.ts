import { AlertController } from "controllers/AlertController";
import { CampaignDocument, ImageDocument } from "types/documents";
import { AssetUploadSource } from "types/enums/assetSource";
import { rest } from "utilities/request";
import { DataController } from "controllers/data/DataController";
import { DataManager } from "controllers/data/DataManager";
import { ImageManager } from "controllers/data/image";

interface UpdateBannerResponse {
  campaign: CampaignDocument,
  image: ImageDocument
}

export class $CampaignController extends DataController<CampaignDocument> {
  /**
   * Updates the banner image for a campaign
   * @param id The ID of the campaign to update
   * @param newBanner The new banner to upload
   * @param method The method of uploading the new banner.
   */
  public async updateBanner(id: string, newBanner: Partial<ImageDocument>, method: AssetUploadSource) {
    const updateBannerURI = `/api/campaigns/${id}/banner`;
    if (!this.isUserLoggedIn()) {
      AlertController.error("You must be logged in to update the banner.");
      return;
    }
    const result = await rest.patch<UpdateBannerResponse>(updateBannerURI, { image: newBanner, method });
    if (!result.success) {
      AlertController.error(`An error occured while updating the banner: ${result.message}`);
      return;
    }

    CampaignManager.set(result.data.campaign);
    ImageManager.set(result.data.image);
    AlertController.success(`The banner for ${result.data.campaign.name} has been successfully updated.`);
    return { campaign: result.data.campaign, image: result.data.image };
  }

}

export const CampaignManager = new DataManager<CampaignDocument>("campaign");
export const CampaignController = new $CampaignController(CampaignManager, "/api/campaigns");
