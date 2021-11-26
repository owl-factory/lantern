import { AlertController } from "controllers/AlertController";
import { CoreDocument } from "types/documents";
import { rest } from "utilities/request";
import { DataManager } from "controllers/data/DataManager";
import { Ref64 } from "types";

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
  }


  /**
   * Creates a new document
   * @param doc The partial document to create
   * @returns Returns the new document. Undefined if there was a failure
   */
  public async create(doc: Partial<T>): Promise<T | undefined> {
    if(!this.isUserLoggedIn()) {
      AlertController.error(`You must be logged in to create ${this.manager.key}.`);
      return undefined;
    }

    // Validate doc

    const result = await rest.put<{ doc: T }>(this.createURI, { doc });

    if (result.success === false) {
      AlertController.error(`An error occured while creating ${this.manager.key}: ${result.message}`);
      return undefined;
    }

    this.manager.set(result.data.doc);
    AlertController.success(`${result.data.doc.name} has been successfully created.`);
    return result.data.doc;
  }


  /**
   * Deletes a single document
   * @param ref The ref of the document to delete
   * @returns True if the delete succeeded, false otherwise
   */
  public async delete(ref: string): Promise<boolean> {
    const deleted = await this.deleteMany([ref]);
    return deleted[ref] || false;
  }


  /**
   * Deletes many documents
   * @param refs A list of refs of the documents to delete
   * @returns An object with refs as keys and the success of deleting that object as the value
   */
  public async deleteMany(refs: string[]): Promise<Record<string, boolean>> {
    const failResponse: Record<string, boolean> = {};
    refs.forEach((ref: string) => { failResponse[ref] = false; });
    if(!this.isUserLoggedIn()) {
      AlertController.error(`You must be logged in to delete ${this.manager.key}.`);
      return failResponse;
    }

    const result = await rest.delete<{ deleted: Record<string, boolean> }>(this.deleteURI, { refs: refs });
    if (result.success === false) {
      AlertController.error(`An error occured while creating ${this.manager.key}: ${result.message}`);
      return failResponse;
    }

    const deletedRefs: string[] = [];
    Object.keys(result.data.deleted).forEach((ref: string) => {
      if (result.data.deleted[ref]) { deletedRefs.push(ref); }
    });
    this.manager.removeMany(deletedRefs);
    return result.data.deleted;
  }


  /**
   * Reads one document from the database
   * @param ref The ID of the document to read
   */
  public async read(ref: Ref64): Promise<T | undefined> {
    const docs = await this.readMany([ref]);
    if (docs.length === 0) { return undefined; }
    return docs[0];
  }


  /**
   * Reads many documents from the database
   * @param refs The refs of the documents to read
   * @returns An unsorted array of all of the found documents
   */
  public async readMany(refs: string[]) {
    if (refs.length === 0) { return []; }
    const result = await rest.post<{ docs: T[] }>(this.readURI, { refs: refs });
    if (!result.success) { return []; }
    this.manager.setMany(result.data.docs);
    return result.data.docs;
  }

  /**
   * Reads documents that are missing from the data manager
   * @param refs All refs, not necessarily missing ones, to check and fetch
   * @returns A list of documents pulled from the database
   */
  public async readMissing(refs: string[]) {
    const missingRefs: string[] = [];
    refs.forEach((ref: Ref64) => {
      if (this.manager.get(ref) === undefined) { missingRefs.push(ref); }
    });
    if (refs.length === 0) { return []; }

    return this.readMany(missingRefs);
  }


  /**
   * Updates a single document in the database
   * @param ref The ref of the document to update
   * @param doc The fields of the document to update
   * @returns Returns the updated document
   */
  public async update(ref: string, doc: Partial<T>): Promise<T | undefined> {
    if(!this.isUserLoggedIn()) {
      AlertController.error(`You must be logged in to update ${this.manager.key}.`);
      return undefined;
    }

    // Validate doc
    const result = await rest.patch<{ doc: T }>(this.updateURI, { ref, doc });
    if (result.success === false) {
      AlertController.error(`An error occured while updating ${this.manager.key}: ${result.message}`);
      return undefined;
    }
    console.log(result)
    return result.data.doc
    this.manager.set(result.data.doc);
    AlertController.success(`${result.data.doc.name} has been successfully updated.`);
    return result.data.doc;
  }


  protected isUserLoggedIn() {
    return true;
  }
}

