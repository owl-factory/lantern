
export * from "types/documents/CoreDocument";
export * from "types/documents/Campaign";
export * from "types/documents/Character";
export * from "types/documents/Content";
export * from "types/documents/ContentType";
export * from "types/documents/File";
export * from "types/documents/Message";
export * from "types/documents/Ruleset";
export * from "types/documents/Scene";
export * from "types/documents/User";
export * from "types/documents/misc";

import * as type from "types/documents";

export type AnyDocument = (
  type.CoreDocument |
  type.CampaignDocument |
  type.CharacterDocument |
  type.ContentDocument |
  type.ContentTypeDocument |
  type.MessageDocument |
  type.RulesetDocument |
  type.SceneDocument |
  type.UserDocument
);
