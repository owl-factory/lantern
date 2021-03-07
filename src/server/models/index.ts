import { getModelForClass } from "@typegoose/typegoose";
import {
  CommonContentType,
  Content,
  ContentTypeDoc,
  Entity,
  ModuleDoc,
  OrganizationDoc,
  RulesetDoc,
} from "../../types";

export const CommonContentTypeModel = getModelForClass(CommonContentType);
export const ContentModel = getModelForClass(Content);
export const ContentTypeModel = getModelForClass(ContentTypeDoc, {schemaOptions: { collection: "contentTypes" } });
export const EntityModel = getModelForClass(Entity);
export const ModuleModel = getModelForClass(ModuleDoc, {schemaOptions: { collection: "modules" } });
export const OrganizationModel = getModelForClass(OrganizationDoc);
export const RulesetModel = getModelForClass(RulesetDoc, {schemaOptions: { collection: "rulesets" } });

/**
 * A generic type for hitting any of the Typegoose models
 */
export type GenericModelType = (
  typeof CommonContentTypeModel |
  typeof ContentModel |
  typeof ContentTypeModel |
  typeof EntityModel |
  typeof ModuleModel |
  typeof OrganizationModel |
  typeof RulesetModel
);
