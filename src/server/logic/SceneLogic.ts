
import * as fauna from "@owl-factory/database/integration/fauna";
import { UserRole } from "@owl-factory/auth/enums";
import { Create, Delete, Fetch, Update } from "@owl-factory/database/decorators/crud";
import { Access, ReadFields, RequireLogin, SetFields } from "@owl-factory/database/decorators/modifiers";
import { SceneDocument } from "types/documents";
import { Collection } from "src/fauna";
import { Ref64 } from "@owl-factory/types";
import { isOwner } from "./security";


const CREATE_FIELDS: string[] = ["name", "campaignID"];

class $SceneLogic {
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
    const ruleset = await fauna.createOne<SceneDocument>(this.collection, doc);
    if (ruleset === undefined) {
      throw {code: 500, message: "An unexpected error occured while creating the document"};
    }
    return ruleset;
  }

  /**
   * Deletes a single document, if present
   * @param ref The ref of the document to delete
   * @returns The deleted document
   */
  @Delete("deleteScene")
  @Access(isOwner)
  public async deleteOne(ref: Ref64) {
    const deletedDoc = await fauna.deleteOne<SceneDocument>(ref);
    if (deletedDoc === undefined) { throw { code: 404, message: `The document with id ${ref} could not be found.`}; }
    return deletedDoc;
  }

  /**
   * Fetches one campaign from its ID
   * @param id The Ref64 ID of the document to fetch
   * @returns The campaign document
   */
  @Fetch("viewMyScene")
  @Access({[UserRole.Guest]: true})
  @RequireLogin()
  @ReadFields(["*"])
  public async findOne(id: Ref64): Promise<SceneDocument> {
    const readDoc = await fauna.findByID<SceneDocument>(id);
    if (readDoc === undefined) { throw { code: 404, message: `A document with ID ${id} could not be found` }; }
    return readDoc;
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
   public async updateOne(ref: Ref64, doc: Partial<SceneDocument>) {
     const updatedDoc = await fauna.updateOne(ref, doc);
     // TODO - better message
     if (updatedDoc === undefined) { throw { code: 404, message: `The document with id ${ref} could not be found.`}; }
     return updatedDoc;
   }
}

export const SceneLogic = new $SceneLogic();
