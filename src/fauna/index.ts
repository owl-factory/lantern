// A list of all collections used within the Fauna database for Reroll
export enum Collection {
  ActorSheets = "actor_sheets",
  Campaigns = "campaigns",
  Characters = "characters",
  ContentTypes = "content_types",
  Contents = "contents",
  Files = "files",
  Images = "images",
  Modules = "modules",
  Rulesets = "rulesets",
  Scenes = "scenes",
  Users = "users",
}

export enum FaunaIndex {
  AllActorSheets="all_actor_sheets",

  CampaignsByUser="campaigns_by_user",
  CharactersByUser="characters_by_user",

  AllContents="all_contents",
  ContentByUser="content_by_user",

  AllContentTypes="all_content_types",

  ImagesByUser="images_by_user",

  AllModules="all_modules",

  AllRulesets="all_rulesets",
  RulesetsByOfficial="rulesets_by_official",
  RulesetsByOfficialPublic="rulesets_by_official_public",

  UsersByEmail="users_by_email",
  UsersByUsername="users_by_username",
}

export const FaunaIndexTerms = {
  // DO NOT INCLUDE XML FOR LARGER INDEXES IN FUTURE
  [FaunaIndex.AllActorSheets]: ["updatedAt", "ref", "name", "ruleset.ref", "xml"],

  [FaunaIndex.CampaignsByUser]: ["lastPlayedAt", "ref", "name", "banner.src"],
  [FaunaIndex.CampaignsByUser]: ["lastPlayedAt", "ref", "name", "banner.src"],
  [FaunaIndex.CharactersByUser]: ["updatedAt", "ref", "name", "ruleset.ref", "campaign.ref", "profile.src"],

  [FaunaIndex.AllContents]: [
    "updatedAt", "ref", "name", "contentType.ref", "contentType.name", "ruleset.ref", "ruleset.name",
  ],
  [FaunaIndex.ContentByUser]: ["updatedAt", "ref", "name", "type.ref", "ruleset.ref", "ownedBy.ref"],

  [FaunaIndex.AllContentTypes]: [
    "updatedAt", "ref", "name", "alias", "ruleset.ref", "ruleset.name", "parent.ref", "parent.name",
  ],

  [FaunaIndex.ImagesByUser]: ["ref", "name", "src"],

  [FaunaIndex.AllModules]: ["updatedAt", "ref", "name", "ruleset.ref", "ruleset.name"],

  [FaunaIndex.AllRulesets]: ["updatedAt", "ref", "name", "ownedBy"],
  [FaunaIndex.RulesetsByOfficial]: ["updatedAt", "ref", "name", "ownedBy", "isPublic", "isLocked"],
  [FaunaIndex.RulesetsByOfficialPublic]: ["updatedAt", "ref", "name", "ownedBy", "isPublic", "isLocked"],
  [FaunaIndex.UsersByEmail]: ["ref"],
  [FaunaIndex.UsersByUsername]: ["ref"],
};
