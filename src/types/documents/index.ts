
export * from "./CoreDocument";
export * from "./Campaign";
export * from "./CommonContentType";
export * from "./Content";
export * from "./ContentType";
export * from "./Entity";
export * from "./Message";
export * from "./Module";
export * from "./Organization";
export * from "./Ruleset";
export * from "./Table";
export * from "./UserProfile";
export * from "./misc";

import { CampaignDoc } from "./Campaign";
import { Content } from "./Content";
import { ContentTypeDoc } from "./ContentType";
import { Entity } from "./Entity";
import { CoreDocument } from "./CoreDocument";
import { MessageDoc } from "./Message";
import { ModuleDoc } from "./Module";
import { OrganizationDoc } from "./Organization";
import { RulesetDoc } from "./Ruleset";
import { TableDoc } from "./Table";
import { UserProfileDoc } from "./UserProfile";

/**
 * A generic document type for any situation where we might be getting document data but
 * we're unsure of the source
 */
export type GenericDocumentType = (
  CampaignDoc |
  Content |
  ContentTypeDoc |
  Entity |
  CoreDocument |
  MessageDoc |
  ModuleDoc |
  OrganizationDoc |
  RulesetDoc |
  TableDoc |
  UserProfileDoc
);
