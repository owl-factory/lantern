import { AssetDocument } from "types/documents";

/**
 * Describes an Image Asset
 */
export interface ImageDocument extends AssetDocument {
  height?: number; // The height of the image
  width?: number; // The width of the image
}
