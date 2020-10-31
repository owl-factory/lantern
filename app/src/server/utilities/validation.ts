// Aliases that may overlap with actual pages, preventing them from

import { PublishType } from "@reroll/model/dist/enums/publishType";
import { ContextParamMetadata } from "type-graphql/dist/metadata/definitions";

// being seen via their aliases
const RESERVED_ALIASES = [
  "about",
  "admin",
  "index",
  "new",
  "undefined"
];
export function isAliasReserved(alias: string) {
  return RESERVED_ALIASES.includes(alias);
}

/**
 * Validates that the user can create something with the given publish type
 * @param ctx The user context to determine the maximum publish type
 * @param publishType The publish type to check
 */
export function validatePublishType(
  ctx: ContextParamMetadata,
  publishType: PublishType | undefined
) {
  // TODO - implement the bulk of this after we get users set
  return "This is a test failure";
}