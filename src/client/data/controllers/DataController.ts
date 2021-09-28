import { CoreDocument } from "types/documents";
import { rest } from "utilities/request";
import { DataManager } from "../managers/DataManager";

export abstract class DataController<T extends CoreDocument> {
  protected manager: DataManager<T>;

  protected createURI = "";
  protected deleteURI = ""; // One or many
  protected readURI = ""; // One or many
  protected updateURI = "";

  constructor(manager: DataManager<T>, defaultURI = "") {
    this.manager = manager;
    if (!this.createURI) { this.createURI = defaultURI;}
    if (!this.deleteURI) { this.deleteURI = defaultURI;}
    if (!this.readURI) { this.readURI = defaultURI;}
    if (!this.updateURI) { this.updateURI = defaultURI;}
    console.log(this.createURI)
  }


  /**
   * Creates a new document
   * @param doc The partial document to create
   * @returns Returns the new document. Undefined if there was a failure
   */
  public async create(doc: Partial<T>): Promise<T | undefined> {
    if(!isUserLoggedIn()) {
      // TODO - post to AlertController
      return undefined;
    }

    // Validate doc

    const result = await rest.put<{ doc: T }>(this.createURI, { doc });

    if (result.success === false) {
      // TODO - Post Error to AlertController & return
      return undefined;
    }

    this.manager.set(result.data.doc);
    return result.data.doc;
  }


  /**
   * Deletes a single document
   * @param id The ID of the document to delete
   * @returns True if the delete succeeded, false otherwise
   */
  public async delete(id: string): Promise<boolean> {
    const deleted = await this.deleteMany([id]);
    return deleted[id] || false;
  }


  /**
   * Deletes many documents
   * @param ids A list of IDs of the documents to delete
   * @returns An object with IDs as keys and the success of deleting that object as the value
   */
  public async deleteMany(ids: string[]): Promise<Record<string, boolean>> {
    const failResponse: Record<string, boolean> = {};
    ids.forEach((id: string) => { failResponse[id] = false; });
    if(!isUserLoggedIn()) {
      // TODO - post to AlertController
      return failResponse;
    }

    const result = await rest.delete<{ deleted: Record<string, boolean> }>(this.deleteURI, { ids: ids });
    if (result.success === false) {
      // TODO - post to AlertController
      return failResponse;
    }

    const deletedIDs: string[] = [];
    Object.keys(result.data.deleted).forEach((id: string) => {
      if (result.data.deleted[id]) { deletedIDs.push(id); }
    });
    this.manager.removeMany(deletedIDs);
    return result.data.deleted;
  }


  /**
   * Reads one document from the database
   * @param id The ID of the document to read
   */
  public async read(id: string): Promise<T | undefined> {
    const docs = await this.readMany([id]);
    if (docs.length === 0) { return undefined; }
    return docs[0];
  }


  /**
   * Reads many documents from the database
   * @param ids The IDs of the documents to read
   * @returns An unsorted array of all of the found documents
   */
  public async readMany(ids: string[]) {
    const result = await rest.post<{ docs: T[] }>(this.readURI, { ids: ids });
    if (!result.success) { return []; }
    console.log(result)
    this.manager.setMany(result.data.docs);
    return result.data.docs;
  }

  /**
   * Reads documents that are missing from the data manager
   * @param ids All IDs, not necessarily missing ones, to check and fetch
   * @returns A list of documents pulled from the database
   */
  public async readMissing(ids: string[]) {
    const missingIDs: string[] = [];
    ids.forEach((id) => {
      if (this.manager.get(id) === undefined) { missingIDs.push(id); }
    });
    if (ids.length === 0) { return []; }

    return this.readMany(missingIDs);
  }


  /**
   * Updates a single document in the database
   * @param id The ID of the document to update
   * @param doc The fields of the document to update
   * @returns Returns the updated document
   */
  public async update(id: string, doc: Partial<T>): Promise<T | undefined> {
    if(!isUserLoggedIn()) {
      // TODO - post to AlertController
      return undefined;
    }

    // Validate doc
    const result = await rest.patch<{ doc: T }>(this.updateURI, { id, doc });
    if (result.success === false) {
      // TODO - Post to AlertManager
      return undefined;
    }
    this.manager.set(result.data.doc);
    return result.data.doc;
  }
}

function isUserLoggedIn() {
  return true;
}
