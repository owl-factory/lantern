
import { Create, Delete, Fetch, Update } from "@owl-factory/database/utilities/decorators/decorators";
import { RequireLogin } from "@owl-factory/database/utilities/decorators/modifiers";
import { SceneDocument } from "types/documents";
import { Collection } from "src/fauna";
import { Ref64 } from "@owl-factory/types";
import * as access from "./access";


const CREATE_FIELDS: string[] = ["name", "campaignID"];

const collection = Collection.Scenes;

class $SceneLogic {
  /**
   * Creates a single new scene document
   * @param doc The document partial to create
   * @returns The new scene document
   */
  @Create(["*"], ["*"])
  public async createScene(doc: Partial<SceneDocument>): Promise<SceneDocument> {
    return await access.create(collection, doc);
  }

  /**
   * Deletes a single document, if present
   * @param ref The ref of the document to delete
   * @returns The deleted document
   */
  @Delete(collection, ["*"], (ref) => access.fetch(collection, ref))
  public async deleteOne(ref: Ref64) {
    return await access.remove(collection, ref);
  }

  /**
   * Fetches one campaign from its ID
   * @param id The Ref64 ID of the document to fetch
   * @returns The campaign document
   */
  @Fetch(collection, ["*"])
  @RequireLogin()
  public async fetch(ref: Ref64): Promise<SceneDocument> {
    return await access.fetch(collection, ref);
  }

  /**
   * Updates a single document
   * @param ref The ref of the document to update
   * @param doc The changes in the document to patch on
   * @returns The updated document
   */
  @Update(collection, ["*"], ["*"], (ref) => access.fetch(collection, ref))
  public async update(ref: Ref64, doc: Partial<SceneDocument>) {
    return await access.update(collection, ref, doc);
  }
}

export const SceneLogic = new $SceneLogic();
