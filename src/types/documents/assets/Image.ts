import { AssetDocument } from "types/documents";
import { AssetType } from "types/enums/assetType";

/**
 * Describes an Image Asset
 */
export interface ImageDocument extends AssetDocument {
  assetType?: AssetType.Image;
  height?: number; // The height of the image
  width?: number; // The width of the image
}
