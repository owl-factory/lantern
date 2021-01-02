
export * from "./Campaign";
export * from "./CommonContentType";
export * from "./CommonEntityType";
export * from "./Content";
export * from "./ContentType";
export * from "./CoreDocument";
export * from "./Entity";
export * from "./EntityLayout";
export * from "./EntityType";
export * from "./GameSystem";
export * from "./Module";
export * from "./Organization";
export * from "./User";

import { Campaign, CampaignModel } from "./Campaign";
import { CommonContentType, CommonContentTypeModel } from "./CommonContentType";
import { CommonEntityType, CommonEntityTypeModel } from "./CommonEntityType";
import { Content, ContentModel } from "./Content";
import { ContentType, ContentTypeModel } from "./ContentType";
import { CoreDocument } from "./CoreDocument";
import { Entity, EntityModel } from "./Entity";
import { EntityLayout, EntityLayoutModel } from "./EntityLayout";
import { EntityType, EntityTypeModel } from "./EntityType";
import { GameSystem, GameSystemModel } from "./GameSystem";
import { Module, ModuleModel } from "./Module";

/**
 * A generic document type for any situation where we might be getting document data but
 * we're unsure of the source
 */
export type GenericDocumentType = (
  Campaign |
  CommonContentType |
  CommonEntityType |
  Content |
  ContentType |
  CoreDocument |
  Entity |
  EntityLayout |
  EntityType |
  GameSystem |
  Module 
);

/**
 * A generic type for hitting any of the Typegoose models
 */
export type GenericModelType = (
  typeof CampaignModel |
  typeof CommonContentTypeModel |
  typeof CommonEntityTypeModel |
  typeof ContentModel |
  typeof ContentTypeModel |
  typeof EntityModel |
  typeof EntityLayoutModel |
  typeof EntityTypeModel |
  typeof GameSystemModel |
  typeof ModuleModel 
);
