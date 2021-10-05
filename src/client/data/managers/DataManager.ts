/**
 * A manager for receiving data from the database, ensuring it is in LocalStorage, and otherwise optimizing
 * sorting and such.
 */

import { action, makeAutoObservable, makeObservable, observable } from "mobx";
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
  public readonly key: string;
  public data: Record<string, T> = {};
  // Tracks when the data manager was last updated. Allows for more seamless tracking of 
  public updatedAt: Date;

  constructor(key: string) {
    this.key = key;
    this.updatedAt = (new Date());

    makeObservable(this, {
      data: observable,
      updatedAt: observable,
      load: action,
      remove: action,
      removeMany: action,
      set: action,
      setMany: action,
    });
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
    this.setMany([doc]);
  }

  /**
   * Sets many documents in the data manager and the storage method
   * @param docs The documents to set in the data manager and the storage method
   */
  public setMany(docs: T[]): void {
    docs.forEach((doc: T) => {
      if (!("id" in doc)) { return; }
      const id = (doc as CoreDocument).id;
      this.data[id] = doc;

      // Sets the document in the local storage
      LOCAL_STORAGE.setItem(this.buildKey(id), JSON.stringify(doc));
    });
    this.updateStorageKeys();
    this.updatedAt = (new Date());
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
