
import * as fauna from "@owl-factory/database/integration/fauna";
import { Create, Delete, Fetch, Update } from "@owl-factory/database/decorators/decorators";
import { Access, ReadFields, RequireLogin, SetFields } from "@owl-factory/database/decorators/modifiers";
import { SceneDocument } from "types/documents";
import { Collection } from "src/fauna";
import { Ref64 } from "@owl-factory/types";
import { DatabaseLogic } from "./AbstractDatabaseLogic";
import { isOwner } from "security/documents";


const CREATE_FIELDS: string[] = ["name", "campaignID"];

class $SceneLogic extends DatabaseLogic<SceneDocument> {
  public collection = Collection.Scenes;

  /**
   * Creates a single new scene document
   * @param doc The document partial to create
   * @returns The new scene document
   */
  @Create("createScene")
  @RequireLogin()
  @ReadFields(["*"])
  @SetFields(CREATE_FIELDS)
  public async createScene(doc: Partial<SceneDocument>): Promise<SceneDocument> {
    return await super.create(doc);
  }

  /**
   * Deletes a single document, if present
   * @param ref The ref of the document to delete
   * @returns The deleted document
   */
  @Delete("deleteScene")
  @Access(isOwner)
  public async deleteOne(ref: Ref64) {
    return await super.delete(ref);
  }

  /**
   * Fetches one campaign from its ID
   * @param id The Ref64 ID of the document to fetch
   * @returns The campaign document
   */
  @Fetch("viewMyScene")
  @RequireLogin()
  @ReadFields(["*"])
  public async fetch(ref: Ref64): Promise<SceneDocument> {
    return await super.fetch(ref);
  }

  /**
   * Updates a single document
   * @param ref The ref of the document to update
   * @param doc The changes in the document to patch on
   * @returns The updated document
   */
  @Update("updateScene")
  @Access(isOwner)
  @ReadFields(["*"])
  @SetFields(["*"])
  public async update(ref: Ref64, doc: Partial<SceneDocument>) {
    return await super.update(ref, doc);
  }
}

export const SceneLogic = new $SceneLogic();
