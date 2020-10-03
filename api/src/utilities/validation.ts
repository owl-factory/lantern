// Aliases that may overlap with actual pages, preventing them from
// being seen via their aliases
const RESERVED_ALIASES = [
  "about",
  "admin",
  "index",
  "new",
];
export function isAliasReserved(alias: string) {
  return RESERVED_ALIASES.includes(alias);
}