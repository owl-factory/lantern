export * from "types/documents/assets/Asset";
export * from "types/documents/assets/Image";

import * as type from "types/documents/assets";

export type AnyAssetDocument = (
  type.AssetDocument |
  type.ImageDocument
);
