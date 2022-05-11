import { FileDocument } from "types/documents";
import { AssetType } from "types/enums/assetType";

/**
 * Describes an Image Asset
 */
export interface ImageDocument extends FileDocument {
  height?: number;
  width?: number;
}
