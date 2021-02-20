
export * from "./Content";
export * from "./ContentType";
export * from "./Entity";
export * from "./CoreDocument";
export * from "./Organization";
export * from "./Ruleset";

import { Content, ContentModel } from "./Content";
import { ContentType, ContentTypeModel } from "./ContentType";
import { Entity, EntityModel } from "./Entity";
import { CoreDocument } from "./CoreDocument";
import { Organization, OrganizationModel } from "./Organization";
import { Ruleset, RulesetModel } from "./Ruleset";

/**
 * A generic document type for any situation where we might be getting document data but
 * we're unsure of the source
 */
export type GenericDocumentType = (
  Content |
  ContentType |
  Entity |
  CoreDocument |
  Organization |
  Ruleset
);

/**
 * A generic type for hitting any of the Typegoose models
 */
export type GenericModelType = (
  typeof ContentModel |
  typeof ContentTypeModel |
  typeof EntityModel |
  typeof OrganizationModel |
  typeof RulesetModel
);
