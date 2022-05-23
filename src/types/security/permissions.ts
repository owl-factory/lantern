import { Permission } from "@owl-factory/auth/types";
import { Collection } from "fauna";

// TODO - this might be better in a more configurable format?
export const permissions: Permission[] = [
  { key: "viewMyCampaigns", name: "View My Campaigns", collection: Collection.Campaigns },
  { key: "viewCampaignsByUser", name: "View Campaigns by User", collection: Collection.Campaigns },
  { key: "createCampaign", name: "Create a Campaign", collection: Collection.Campaigns },
  { key: "editMyCampaign", name: "Edit Played Campaign", collection: Collection.Campaigns },
  { key: "editAnyCampaign", name: "Edit Any Campaign", collection: Collection.Campaigns },
  { key: "deleteMyCampaign", name: "Delete My Campaign", collection: Collection.Campaigns },
  { key: "deleteAnyCampaign", name: "Delete Any Campaign", collection: Collection.Campaigns },

  { key: "createCharacter", name: "Create a Character", collection: Collection.Characters },
  { key: "deleteCharacter", name: "Delete a Character", collection: Collection.Characters },
  { key: "deleteMyCharacter", name: "Delete My Character", collection: Collection.Characters },
  { key: "viewMyCharacters", name: "View My Characters", collection: Collection.Characters },
  { key: "viewGameCharacters", name: "View Characters in my Game", collection: Collection.Characters },
  { key: "editMyCharacter", name: "Edit My Characters", collection: Collection.Characters },
  { key: "searchCharactersByUser", name: "Search Characters By User", collection: Collection.Characters },
  { key: "searchMyCharacters", name: "Search My Characters", collection: Collection.Characters },

  { key: "viewContent", name: "View Content", collection: Collection.Contents },
  { key: "searchContentByUser", name: "Search Content By User", collection: Collection.Contents },
  { key: "searchMyContent", name: "Search My Content", collection: Collection.Contents },
  { key: "createContent", name: "Create Content", collection: Collection.Contents },
  { key: "updateContent", name: "Update Content", collection: Collection.Contents },
  { key: "deleteContent", name: "Delete Content", collection: Collection.Contents },

  { key: "createContentType", name: "Create Content Type", collection: Collection.ContentTypes },
  { key: "updateContentType", name: "Update Content Type", collection: Collection.ContentTypes },
  { key: "deleteContentType", name: "Delete Content Type", collection: Collection.ContentTypes },
  { key: "viewContentType", name: "View Content Type", collection: Collection.ContentTypes },

  { key: "uploadFile", name: "Upload a File", collection: Collection.Files },

  { key: "createExternalImage", name: "Create Externally Linked Image", collection: Collection.Images },
  { key: "deleteImage", name: "Delete My Image", collection: Collection.Images },
  { key: "viewAnyImage", name: "View Any Image", collection: Collection.Images },
  { key: "searchImagesByUser", name: "Search Images By User", collection: Collection.Images },
  { key: "searchMyImages", name: "Search My Images", collection: Collection.Images },

  { key: "createModule", name: "Create a Module", collection: Collection.Modules },
  { key: "updateModule", name: "Update a Module", collection: Collection.Modules },
  { key: "deleteModule", name: "Delete a Module", collection: Collection.Modules },

  { key: "createOfficialRuleset", name: "Create an Official Ruleset", collection: Collection.Rulesets },
  { key: "viewAnyRuleset", name: "View Any Ruleset", collection: Collection.Rulesets },
  { key: "createRuleset", name: "Create a Ruleset", collection: Collection.Rulesets },
  { key: "updateRuleset", name: "Update a Ruleset", collection: Collection.Rulesets },
  { key: "deleteRuleset", name: "Delete a Ruleset", collection: Collection.Rulesets },
  { key: "editOfficialRuleset", name: "Edit an Official Ruleset", collection: Collection.Rulesets },
  { key: "searchRulesetsByOfficial", name: "Search for Official Rulesets", collection: Collection.Rulesets },
  {
    key: "searchOfficialAndPublicRulesets",
    name: "Search Official and Public Rulesets",
    collection: Collection.Rulesets,
  },

  { key: "createScene", name: "Create a Scene", collection: Collection.Scenes },

  { key: "viewUser", name: "View a User", collection: Collection.Users },
  { key: "searchByUsername", name: "Search By Username", collection: Collection.Users },
  { key: "updateMyUser", name: "Updates My User", collection: Collection.Users },
];
