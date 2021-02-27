
export * from "./Content";
export * from "./ContentType";
export * from "./Entity";
export * from "./CoreDocument";
export * from "./Organization";
export * from "./Ruleset";

import { Content, ContentModel } from "./Content";
import { ContentTypeDoc, ContentTypeModel } from "./ContentType";
import { Entity, EntityModel } from "./Entity";
import { CoreDocument } from "./CoreDocument";
import { ModuleDoc, ModuleModel } from "./Module";
import { OrganizationDoc, OrganizationModel } from "./Organization";
import { RulesetDoc, RulesetModel } from "./Ruleset";

/**
 * A generic document type for any situation where we might be getting document data but
 * we're unsure of the source
 */
export type GenericDocumentType = (
  Content |
  ContentTypeDoc |
  Entity |
  CoreDocument |
  ModuleDoc |
  OrganizationDoc |
  RulesetDoc
);

/**
 * A generic type for hitting any of the Typegoose models
 */
export type GenericModelType = (
  typeof ContentModel |
  typeof ContentTypeModel |
  typeof EntityModel |
  typeof ModuleModel |
  typeof OrganizationModel |
  typeof RulesetModel
);
