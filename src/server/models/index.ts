import { getModelForClass } from "@typegoose/typegoose";
import {
  CampaignDoc,
  CommonContentType,
  Content,
  ContentTypeDoc,
  Entity,
  MessageDoc,
  ModuleDoc,
  OrganizationDoc,
  RulesetDoc,
  TableDoc,
  UserProfileDoc,
} from "types";

export const CampaignModel = getModelForClass(CampaignDoc, {schemaOptions: { collection: "campaigns" } });
export const CommonContentTypeModel = getModelForClass(CommonContentType);
export const ContentModel = getModelForClass(Content);
export const ContentTypeModel = getModelForClass(ContentTypeDoc, {schemaOptions: { collection: "contentTypes" } });
export const EntityModel = getModelForClass(Entity);
export const MessageModel = getModelForClass(MessageDoc, {schemaOptions: { collection: "modules" } });
export const ModuleModel = getModelForClass(ModuleDoc, {schemaOptions: { collection: "modules" } });
export const OrganizationModel = getModelForClass(OrganizationDoc);
export const RulesetModel = getModelForClass(RulesetDoc, {schemaOptions: { collection: "rulesets" } });
export const TableModel = getModelForClass(TableDoc, {schemaOptions: { collection: "tables" } });
export const UserProfileModel = getModelForClass(UserProfileDoc, {schemaOptions: { collection: "userProfiles" } });

/**
 * A generic type for hitting any of the Typegoose models
 */
export type GenericModelType = (
  typeof CampaignModel |
  typeof CommonContentTypeModel |
  typeof ContentModel |
  typeof ContentTypeModel |
  typeof EntityModel |
  typeof MessageModel |
  typeof ModuleModel |
  typeof OrganizationModel |
  typeof RulesetModel |
  typeof TableModel |
  typeof UserProfileModel
);
