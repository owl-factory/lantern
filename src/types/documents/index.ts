
export * from "types/documents/assets";
export * from "types/documents/CoreDocument";
export * from "types/documents/Campaign";
export * from "types/documents/Message";
export * from "types/documents/Scene";
export * from "types/documents/User";
export * from "types/documents/misc";

import * as type from "types/documents";

export type AnyDocument = (
  type.AnyAssetDocument |
  type.CoreDocument |
  type.CampaignDocument |
  type.MessageDocument |
  type.SceneDocument |
  type.UserDocument
);
