
import * as fauna from "database/integration/fauna";
import { UserRole } from "types/security";
import { Create } from "database/decorators/crud";
import { Access, ReadFields, SetFields } from "database/decorators/modifiers";
import { SceneDocument } from "types/documents";
import { Collection } from "fauna";


const CREATE_FIELDS: string[] = ["name", "campaignID"];

class $SceneLogic {
  public collection = Collection.Scenes;

  /**
   * Creates a single new scene document 
   * @param doc The document partial to create
   * @returns The new scene document
   */
  @Create
  @Access({[UserRole.User]: true})
  @ReadFields(["*"])
  @SetFields(CREATE_FIELDS)
  public async createOne(doc: Partial<SceneDocument>): Promise<SceneDocument> {
    const scene = await fauna.createOne<SceneDocument>(this.collection, doc);
    if (scene === undefined) {
      throw {code: 500, message: "An unexpected error occured while creating the document"};
    }
    return scene;
  }
}

export const SceneLogic = new $SceneLogic();
