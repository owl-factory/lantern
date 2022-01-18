import { AssetDocument } from "types/documents";
import { AssetType } from "types/enums/assetType";

/**
 * Describes an Image Asset
 */
export interface ImageDocument extends AssetDocument {
  height?: number;
  width?: number;
}
