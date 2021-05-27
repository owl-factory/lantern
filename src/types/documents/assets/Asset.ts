import { CoreDocument } from "../CoreDocument";

/**
 * Describes a core asset item, which can become any media that a user may upload
 */
export interface AssetDocument extends CoreDocument {
  src?: string; // Where this asset may be found
  sizeInBytes?: number; // The size of this asset in bytes

  isExternal?: boolean; // If this is an externally linked item
}
