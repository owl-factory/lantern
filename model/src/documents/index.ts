export * from "./Asset";
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
export * from "./Rule";
export * from "./User";

import { Asset, AssetModel}  from "./Asset";
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
import { Organization, OrganizationModel } from "./Organization";
import { Rule, RuleModel } from "./Rule";
import { User, UserModel } from "./User";

export type GenericDocumentType = (
  Asset | 
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
  Module |
  Organization |
  Rule |
  User
);

export type GenericModelType = (
  typeof AssetModel | 
  typeof CampaignModel | 
  typeof CommonContentTypeModel |
  typeof CommonEntityTypeModel |
  typeof ContentModel |
  typeof ContentTypeModel |
  typeof EntityModel |
  typeof EntityLayoutModel |
  typeof EntityTypeModel |
  typeof GameSystemModel |
  typeof ModuleModel |
  typeof OrganizationModel |
  typeof RuleModel |
  typeof UserModel
);