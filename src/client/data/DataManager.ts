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
  protected $fetchMany: ((ids: string[]) => Promise<CoreDocument[]>) | undefined = undefined;


  constructor(key: string, options?: DataManagerOptions) {
    this.key = key;
    if (!options) { return; }
    if ("fetchMany" in options && options.fetchMany) { this.$fetchMany = options.fetchMany; }

    makeAutoObservable(this);
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
   * Gets a single document from the data manager. No external calls are made
   * @param id The id of the document to fetch from the manager
   * @returns A single document from the data manager
   */
  public get(id: string): T | undefined {
    if (id in this.data) { return this.data[id]; }
    return undefined;
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
   * Returns a list of all currently used ids in the manager
   * @returns A list of all keys currently saved in the Manager
   */
  public getKeys() {
    return Object.keys(this.data);
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
    })
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
    LOCAL_STORAGE.setItem(`${this.key}_${id}`, JSON.stringify(doc));
    // Sets the updated list of keys/ids in the local storage
    LOCAL_STORAGE.setItem(`${this.key}_ids`, JSON.stringify(Object.keys(this.data)));
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

}
