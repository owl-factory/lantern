
import * as fauna from "database/integration/fauna";
import { UserRole } from "types/security";
import { Create, Fetch, FetchMany } from "database/decorators/crud";
import { Access, ReadFields, RequireLogin, SetFields } from "database/decorators/modifiers";
import { SceneDocument } from "types/documents";
import { Collection } from "fauna";
import { Ref64 } from "types";


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

  /**
   * Fetches one campaign from its ID
   * @param id The Ref64 ID of the document to fetch
   * @returns The campaign document
   */
   @Fetch
   @Access({[UserRole.User]: true, [UserRole.Admin]: true})
   @RequireLogin()
   public async findByID(id: Ref64): Promise<SceneDocument> {
     const campaign = await fauna.findByID<SceneDocument>(id);
     if (campaign === undefined) { throw { code: 404, message: `A campaign with ID ${id} could not be found` }; }
     return campaign;
   }

  /**
   * Fetches many scenes from their IDs
   * @param ids The Ref64 IDs of the documents to fetch
   * @returns The found and allowed campaign documents
   */
   @FetchMany
   @Access({[UserRole.User]: true, [UserRole.Admin]: true})
   @RequireLogin()
   public async findManyByIDs(ids: Ref64[]): Promise<SceneDocument[]> {
     const scenes = await fauna.findManyByIDs<SceneDocument>(ids);
     return scenes;
   }
}

export const SceneLogic = new $SceneLogic();
