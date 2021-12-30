// A list of all collections used within the Fauna database for Reroll
export enum Collection {
  Campaigns = "campaigns",
  Characters = "characters",
  ContentTypes = "content_types",
  Contents = "contents",
  Images = "images",
  Rulesets = "Rulesets",
  Scenes = "scenes",
  Users = "users",
}

export enum FaunaIndex {
  CampaignsByUser="campaigns_by_user",
  CharactersByUser="characters_by_user",
  ContentByUser="content_by_user",
  ImagesByUser="images_by_user",
  RulesetsByOfficial="rulesets_by_official",
  RulesetsByOfficialPublic="rulesets_by_official_public",
  UsersByEmail="users_by_email",
  UsersByUsername="users_by_username",
}

export const FaunaIndexTerms = {
  [FaunaIndex.CampaignsByUser]: ["lastPlayedAt", "ref", "name", "banner.src"],
  [FaunaIndex.CharactersByUser]: ["updatedAt", "ref", "name", "ruleset.ref", "campaign.ref", "profile.src"],
  [FaunaIndex.ContentByUser]: ["updatedAt", "ref", "name", "type.ref", "ruleset.ref", "ownedBy.ref"],
  [FaunaIndex.ImagesByUser]: ["ref", "name", "src"],
  [FaunaIndex.RulesetsByOfficial]: ["updatedAt", "ref", "name", "ownedBy", "isPublic", "isLocked"],
  [FaunaIndex.RulesetsByOfficialPublic]: ["updatedAt", "ref", "name", "ownedBy", "isPublic", "isLocked"],
  [FaunaIndex.UsersByEmail]: ["ref"],
  [FaunaIndex.UsersByUsername]: ["ref"],
};
