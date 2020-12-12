// Aliases that may overlap with actual pages, preventing them from
// being seen via their aliases
const RESERVED_ALIASES = [
  "about",
  "admin",
  "index",
  "new",
  "undefined",
];
export function isAliasReserved(alias: string): boolean {
  return RESERVED_ALIASES.includes(alias);
}

/**
 * Validates that the user can create something with the given publish type
 * TODO - leaving because this might be used somewhere, but will eventually be determined by other factors
 * @param ctx The user context to determine the maximum publish type
 * @param publishType The publish type to check
 */
export function validatePublishType(
  // ctx: ContextParamMetadata,
  // publishType: PublishType | undefined
): string {

  // TODO - implement the bulk of this after we get users set
  return "This is a test failure";
}
