export * from "./Asset";
export * from "./Campaign";
export * from "./CommonContentType";
export * from "./CommonEntityType";
export * from "./Content";
export * from "./ContentType";
export * from "./CoreInput";
export * from "./Entity";
export * from "./EntityLayout";
export * from "./EntityType";
export * from "./GameSystem";
export * from "./Module";
export * from "./Rule";
export * from "./Organization";
export * from "./User";

import { CreateAssetInput, UpdateAssetInput }  from "./Asset";
import { CreateCampaignInput, UpdateCampaignInput } from "./Campaign";
import { CreateCommonContentTypeInput, UpdateCommonContentTypeInput } from "./CommonContentType";
import { CreateCommonEntityTypeInput, UpdateCommonEntityTypeInput } from "./CommonEntityType";
import { CreateContentInput, UpdateContentInput } from "./Content";
import { CreateContentTypeInput, UpdateContentTypeInput } from "./ContentType";
import { CreateEntityInput, UpdateEntityInput } from "./Entity";
import { CreateEntityLayoutInput, UpdateEntityLayoutInput } from "./EntityLayout";
import { CreateEntityTypeInput, UpdateEntityTypeInput } from "./EntityType";
import { CreateGameSystemInput, UpdateGameSystemInput } from "./GameSystem";
import { CreateModuleInput, UpdateModuleInput } from "./Module";
import { CreateOrganizationInput, UpdateOrganizationInput } from "./Organization";
import { CreateRuleInput, UpdateRuleInput } from "./Rule";
import { CreateUserInput, UpdateUserInput } from "./User";

// A generic input type that can be passed into forms and GraphQL.
export type GenericInputType = GenericCreateInputType | GenericUpdateInputType;

/**
 * A generic create input type
 */
export type GenericCreateInputType = (
  CreateAssetInput |
  CreateCampaignInput |
  CreateCommonContentTypeInput |
  CreateCommonEntityTypeInput |
  CreateContentInput |
  CreateContentTypeInput |
  CreateEntityInput |
  CreateEntityLayoutInput |
  CreateEntityTypeInput |
  CreateGameSystemInput |
  CreateModuleInput |
  CreateOrganizationInput |
  CreateRuleInput |
  CreateUserInput
);

/**
 * A generic update input type
 */
export type GenericUpdateInputType = (
  UpdateAssetInput |
  UpdateCampaignInput |
  UpdateCommonContentTypeInput |
  UpdateCommonEntityTypeInput |
  UpdateContentInput |
  UpdateContentTypeInput |
  UpdateEntityInput |
  UpdateEntityLayoutInput |
  UpdateEntityTypeInput |
  UpdateGameSystemInput |
  UpdateModuleInput |
  UpdateOrganizationInput |
  UpdateRuleInput |
  UpdateUserInput
);
