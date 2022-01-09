import { CacheController } from "@owl-factory/cache/AbstractCacheController";
import { AlertController } from "@owl-factory/components/alert/AlertController";
import { CampaignDocument, ImageDocument } from "types/documents";
import { AssetUploadSource } from "types/enums/assetSource";
import { rest } from "utilities/request";

class $CampaignCache extends CacheController<CampaignDocument> {
  key = "campaign";
  apiURL = '/api/campaigns';

  /**
   * Updates the banner image for a campaign
   * TODO - implement working update Banner
   * @param id The ID of the campaign to update
   * @param newBanner The new banner to upload
   * @param method The method of uploading the new banner.
   */
   public async updateBanner(id: string, newBanner: Partial<ImageDocument>, method: AssetUploadSource) {
    const updateBannerURI = `/api/campaigns/${id}/banner`;

    // const result = await rest.patch<UpdateBannerResponse>(updateBannerURI, { image: newBanner, method });
    // if (!result.success) {
    //   AlertController.error(`An error occured while updating the banner: ${result.message}`);
    //   return;
    // }

    // const cachedCampaign = this.$toCacheItem([result.data.campaign])

    // this.$setMany([result.data.campaign);
    // AlertController.success(`The banner for ${result.data.campaign.name} has been successfully updated.`);
    // return { campaign: result.data.campaign, image: result.data.image };
  }
}

export const CampaignCache = new $CampaignCache();
