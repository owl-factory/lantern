import { CampaignDocument, ImageDocument } from "types/documents";
import { AssetUploadSource } from "types/enums/assetSource";
import { rest } from "utilities/request";
import { CampaignManager, ImageManager } from "../managers";
import { DataController } from "./DataController";

interface UpdateBannerResponse {
  campaign: CampaignDocument,
  image: ImageDocument
}

class $CampaignController extends DataController<CampaignDocument> {
  /**
   * Updates the banner image for a campaign
   * @param id The ID of the campaign to update
   * @param newBanner The new banner to upload
   * @param method The method of uploading the new banner.
   */
  public async updateBanner(id: string, newBanner: Partial<ImageDocument>, method: AssetUploadSource) {
    const updateBannerURI = `/api/campaigns/${id}/banner`;
    if (!this.isUserLoggedIn()) {
      // TODO - push to alert controller
      return;
    }
    const result = await rest.patch<UpdateBannerResponse>(updateBannerURI, { image: newBanner, method });
    if (!result.success) {
      // TODO - push error to alert controller
      return;
    }

    CampaignManager.set(result.data.campaign);
    ImageManager.set(result.data.image);
    return { campaign: result.data.campaign, image: result.data.image };
  }

}

export const CampaignController = new $CampaignController(CampaignManager, "/api/campaigns");
