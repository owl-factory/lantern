export * from "./Asset";
export * from "./Campaign";
export * from "./CommonContentType";
export * from "./CommonEntityType";
export * from "./Content";
export * from "./ContentType";
export * from "./CoreFilter";
export * from "./Entity";
export * from "./EntityLayout";
export * from "./EntityType";
export * from "./GameSystem";
export * from "./Module";
export * from "./Organization";
export * from "./Rule";
export * from "./User";

import { AssetFilter, AssetFilters }  from "./Asset";
import { CampaignFilter, CampaignFilters } from "./Campaign";
import { CommonContentTypeFilter, CommonContentTypeFilters } from "./CommonContentType";
import { CommonEntityTypeFilter, CommonEntityTypeFilters } from "./CommonEntityType";
import { ContentFilter, ContentFilters } from "./Content";
import { ContentTypeFilter, ContentTypeFilters } from "./ContentType";
import { EntityFilter, EntityFilters } from "./Entity";
import { EntityLayoutFilter, EntityLayoutFilters } from "./EntityLayout";
import { EntityTypeFilter, EntityTypeFilters } from "./EntityType";
import { GameSystemFilter, GameSystemFilters } from "./GameSystem";
import { ModuleFilter, ModuleFilters } from "./Module";
import { OrganizationFilter, OrganizationFilters } from "./Organization";
import { RuleFilter, RuleFilters } from "./Rule";
import { UserFilter, UserFilters } from "./User";

/**
 * A generic filter type that will cover any filters supplied to GraphQL or inside of an OR
 */
export type GenericFilterType = (
  AssetFilter | 
  CampaignFilter | 
  CommonContentTypeFilter |
  CommonEntityTypeFilter |
  ContentFilter |
  ContentTypeFilter |
  EntityFilter |
  EntityLayoutFilter |
  EntityTypeFilter |
  GameSystemFilter |
  ModuleFilter |
  OrganizationFilter |
  RuleFilter |
  UserFilter
);

/**
 * A generic filters type that will cover any filters supplied to GraphQL, including any Ors. 
 */
export type GenericFiltersType = (
  AssetFilters | 
  CampaignFilters | 
  CommonContentTypeFilters |
  CommonEntityTypeFilters |
  ContentFilters |
  ContentTypeFilters |
  EntityFilters |
  EntityLayoutFilters |
  EntityTypeFilters |
  GameSystemFilters |
  ModuleFilters |
  OrganizationFilters |
  RuleFilters |
  UserFilters
);