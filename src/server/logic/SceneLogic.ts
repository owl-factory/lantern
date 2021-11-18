
import { FaunaLogicBuilder } from "server/faunaLogicBuilder/FaunaLogicBuilder";
import * as fauna from "database/integration/fauna";
import { UserRole } from "types/security";
import { Create } from "database/decorators/crud";
import { Access, ReadFields, SetFields } from "database/decorators/modifiers";
import { SceneDocument } from "types/documents";
import { Collection } from "fauna";

const USER_VIEW_FIELDS: string[] = [
];

const CREATE_FIELDS: string[] = ["name", "campaignID"];
const UPDATE_FIELDS: string[] = ["name", "campaignID", ]

class $SceneLogic {
  public collection = Collection.Scenes;

  @Create
  @Access({[UserRole.User]: true})
  @ReadFields(["*"])
  @SetFields(CREATE_FIELDS)
  public async createOne(doc: Partial<SceneDocument>): Promise<SceneDocument> {
    const ruleset = await fauna.createOne<SceneDocument>(this.collection, doc);
    if (ruleset === undefined) {
      throw {code: 500, message: "An unexpected error occured while creating the document"};
    }
    return ruleset;
  }
}

export const SceneLogic = new $SceneLogic();

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
// export const SceneLogic = SceneLogicBuilder.export();
