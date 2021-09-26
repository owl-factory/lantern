/**
 * A manager for receiving data from the database, ensuring it is in LocalStorage, and otherwise optimizing
 * sorting and such.
 */

import { makeAutoObservable } from "mobx";
import { AnyDocument, CoreDocument } from "types/documents";
import { read } from "utilities/objects";
import { rest } from "utilities/request";
import { isClient } from "utilities/tools";

const mockLocalStorage = {
  clear: () => { return; },
  getItem: (key: string) => { return undefined; },
  removeItem: (key: string) => { return; },
  setItem: (key: string, value: any) => { return; },
};

const LOCAL_STORAGE = isClient ? window.localStorage : mockLocalStorage;

interface DataManagerOptions {
  fetchMany?: (ids: string[]) => Promise<CoreDocument[]>;
}

interface GetPageOptions {
  match?: (doc: AnyDocument) => boolean;
  page?: number;
  size?: number;
}


/**
 * A data manager that can fetch and cache data in a storage system. This does nothing unique
 * for different document types. For that, a specific Controller is needed.
 */
export class DataManager<T extends CoreDocument> {
  protected key: string;
  public data: Record<string, T> = {};
  // Tracks when the data manager was last updated. Allows for more seamless tracking of 
  public updatedAt: Date;

  protected $create: ((doc: Partial<T>) => Promise<T | undefined>) | undefined = undefined;
  protected $deleteMany: ((ids: string[]) => Promise<Record<string, boolean>>) | undefined = undefined;
  protected $fetchMany: ((ids: string[]) => Promise<CoreDocument[]>) | undefined = undefined;
  protected $update: ((id: string, doc: Partial<T>) => Promise<T | undefined>) | undefined = undefined;

  constructor(key: string, options?: DataManagerOptions) {
    this.key = key;
    this.updatedAt = new Date();
    if (!options) { return; }
    if ("fetchMany" in options && options.fetchMany) { this.$fetchMany = options.fetchMany; }

    makeAutoObservable(this);
  }

  /**
   * Creates a single new document
   * @param doc The partial document to create
   * @returns Returns the created document on success, nothing on failure
   */
  public async create(doc: Partial<T>): Promise<T | undefined> {
    if (!this.$create) { return undefined; }

    const newDoc = await this.$create(doc);
    if (!newDoc) { return undefined; }
    this.set(newDoc);
    return newDoc;
  }

  /**
   * Deletes a single document
   * @param id The ID of the document to remove from the database and from the data manager.
   */
  public async delete(id: string) {
    this.deleteMany([id]);
  }

  /**
   * Deletes many documents from the database and removes them from the data manager on success
   * @param ids The list of document IDs to delete
   */
  public async deleteMany(ids: string[]): Promise<void> {
    if (!this.$deleteMany) { return; }
    const deleteResponse = await this.$deleteMany(ids);
    if (!deleteResponse) { return; }

    const keys = Object.keys(deleteResponse);
    keys.forEach((id: string) => {
      // If this ID is false, it failed to delete. Exit out of this iteration
      if (deleteResponse[id] === false) { return; }
      this.remove(id);
    });
  }

  /**
   * Fetches a single document using a provided function and stores the returned document, if any, to storage
   * @param id The id of a document to fetch
   */
  public async fetch(id: string): Promise<void> {
    this.fetchMany([id]);
  }

  /**
   * Fetches a number of documents using a provided function and stores the returned documents, if any, to storage
   * @param ids The ids of a number of documents to fetch.
   */
  public async fetchMany(ids: string[]): Promise<void> {
    if (ids.length === 0) { return; }
    if (this.$fetchMany === undefined) { return; }
    // TODO - make unique
    const docs = await this.$fetchMany(ids);
    this.setMany(docs as T[]);
  }

  /**
   * Determines which IDs need to be sent to the fetchMany function
   * @param ids A list of ids to verify are present and fetch if not
   */
  public async fetchMissing(ids: string[]): Promise<void> {
    if (this.$fetchMany === undefined) { return; }
    const missingIDs: string[] = [];
    ids.forEach((id: string) => {
      if (!(id in this.data)) {
        missingIDs.push(id);
      }
    });
    this.fetchMany(missingIDs);
  }

  /**
   * Updates a single document
   * @param id The ID of the document to update
   * @param doc The changes to the document to make
   */
  public async update(id: string, doc: Partial<T>): Promise<void> {
    if (this.$update === undefined) { return; }

    const updatedDoc = await this.$update(id, doc);
    if (!updatedDoc) { return; }
    this.set(updatedDoc);
    return;
  }

  /**
   * Gets a single document from the data manager. No external calls are made
   * @param id The id of the document to fetch from the manager
   * @returns A single document from the data manager
   */
  public get(id: string): T | undefined {
    if (id in this.data) { return this.data[id]; }
    return undefined;
  }

  /**
   * Returns a list of all currently used ids in the manager
   * @returns A list of all keys currently saved in the Manager
   */
   public getKeys() {
    return Object.keys(this.data);
  }

  /**
   * Finds and returns a list of documents from a list of given IDs
   * @param ids The IDs of the documents to return
   * @returns An array of documents. Undefined documents will not be present
   */
  public getMany(ids: string[]): T[] {
    const docs: T[] = [];
    ids.forEach((id: string) => {
      if (id in this.data) { docs.push(this.data[id]); }
    });

    return docs;
  }

  /**
   * Fetches a single page of documents
   * TODO - add options for the size and number of pages
   * @returns An array of documents for a single page
   */
  public getPage(options: GetPageOptions = {}): T[] {
    const page: T[] = [];
    Object.keys(this.data).forEach((key: string) => {
      if (options.size !== undefined && page.length >= options.size) { return; }
      if (options.match) {
        if (options.match(this.data[key])) {
          page.push(this.data[key]);
        }
        return;
      }

      page.push(this.data[key]);
    });
    return page;
  }

  /**
   * Loops through each item in the storage manager and finds unique values for a given location. 
   * @param target The object key (optionally deep nested) to scan through for unique values
   * @returns An unsorted array of unique values
   */
  public getUniques(target: string): string[] {
    const uniques: Record<string, number> = {};
    const keys = Object.keys(this.data);
    keys.forEach((key: string) => {
      const item = this.data[key];
      if (!item) { return; }
      const value = read(item as Record<string, unknown>, target);

      // Objects are not supported right now.
      // TODO - implement dates if we need it
      if (typeof value === "object") { return; }
      uniques[value as (string | number)] = 1;
    });
    return Object.keys(uniques);
  }

  /**
   * Loads items from the storage medium (local storage as of 9/7/21)
   */
  public load(): void {
    // A list of stored IDs are loaded in from local storage
    const storedIDs = LOCAL_STORAGE.getItem(`${this.key}_ids`);
    if (!storedIDs) { return; }

    // Loop through each ID and load it in from local storage
    const ids = JSON.parse(storedIDs);
    ids.forEach((id: string) => {
      const storedDoc: string | null | undefined = LOCAL_STORAGE.getItem(`${this.key}_${id}`);
      if (!storedDoc) { console.warn(`Expected a stored value for ID ${id} but none was found.`); }
      const doc = JSON.parse(storedDoc as string);
      this.set(doc);
    });
  }

  /**
   * Removes a single document from the Data Manager and Local Storage. Does not remove from the database
   * @param id The ID of the document to remove
   */
  public remove(id: string) {
    this.removeMany([id]);
  }

  public removeMany(ids: string[]) {
    ids.forEach((id: string) => {
      delete this.data[id];
      LOCAL_STORAGE.removeItem(this.buildKey(id));
    });
    this.updateStorageKeys();
  }

  /**
   * Sets a document in the data manager. Updates both the data manager and the instance in local storage
   * @param doc The document to add or update in the data manager
   */
  public set(doc: T): void {
    if (!("id" in doc)) { return; }
    const id = (doc as CoreDocument).id;
    this.data[id] = doc;
    // TODO - update indexes

    // Sets the document in the local storage
    LOCAL_STORAGE.setItem(this.buildKey(id), JSON.stringify(doc));
    // Sets the updated list of keys/ids in the local storage
    this.updateStorageKeys();
    this.updatedAt = new Date();
  }

  /**
   * Sets many documents in the data manager and the storage method
   * @param docs The documents to set in the data manager and the storage method
   */
  public setMany(docs: T[]): void {
    docs.forEach((doc: T) => {
      this.set(doc);
    });
  }


  private buildKey(id: string) {
    return `${this.key}_${id}`;
  }

  /**
   * Sets the updated list of keys/ids in local storage
   */
  private updateStorageKeys() {
    LOCAL_STORAGE.setItem(`${this.key}_ids`, JSON.stringify(Object.keys(this.data)));
  }
}
