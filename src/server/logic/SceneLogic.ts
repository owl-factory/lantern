
import { FaunaLogicBuilder } from "server/faunaLogicBuilder/FaunaLogicBuilder";
import { CampaignDocument, UserDocument } from "types/documents";
import { MyUserDocument } from "types/security";

const USER_VIEW_FIELDS: string[] = [
];

const CREATE_FIELDS: string[] = ["name", "campaignID"];
const UPDATE_FIELDS: string[] = ["name", "campaignID", ]
const SceneLogicBuilder = new FaunaLogicBuilder("scenes")
  // Globals
  // Users are only able to view campaigns if they are a player, and all fields if they are an owner/GM
  .fields()
    .guest(["*"])
  .done()
  .roles()
    .guest(true)
  .done()

  // .search("findByRuleset", "find_by_ruleset")
    
  // .done()

  /**
   * Creates a single new scene
   */
  .create()
    .roles()
      .guest(false)
      .user(true)
    .done()
    .setFields()
      .user(CREATE_FIELDS)
    .done()
  .done()

  
.done();
export const SceneLogic = SceneLogicBuilder.export();
