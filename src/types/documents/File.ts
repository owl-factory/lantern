import { AssetSource } from "types/enums/assetSource";
import { BaseDocument } from "./BaseDocument";

export const fileExtentionMap: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export interface FileDocument extends BaseDocument {
  src: string; // The full URL to access the document's source.

  mimetype: string;

  // AWS
  s3Key?: string; // The unique image key
  s3Path?: string; // The full key used to access this file in AWS
  isPending?: boolean; // True if this still requires verification. Undefined otherwise

  sizeInBytes: number; // The size in bytes that the document uses in storage. For all non-uploaded documents, this is 0
  source: AssetSource; // The method that the asset was created through
  isPixiLoadable?: boolean; // Indicates that the image can be loaded into pixiJS.
}
