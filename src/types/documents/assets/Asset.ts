import { AssetSource } from "types/enums/assetSource";
import { AssetType } from "types/enums/assetType";
import { CoreDocument } from "../CoreDocument";

/**
 * Describes a core asset item, which can become any media that a user may upload
 */
export interface AssetDocument extends CoreDocument {
  assetType?: AssetType; // What type of asset this is
  src?: string; // Where this asset may be found
  sizeInBytes?: number; // The size of this asset in bytes
  assetSource?: AssetSource; // The source of this asset

  internalAsset?: AssetDocument; // The image document that this asset comes from
}
