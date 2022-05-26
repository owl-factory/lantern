import { Packet } from "@owl-factory/data/types";
import { Ref64 } from "@owl-factory/types";
import { DataController } from "./data";
import { ReloadPolicy } from "./enums";
import { newMetadata, newPacket } from "./helpers/caching";
import { GroupingController } from "./grouping";
import { SearchParams } from "./types";
import * as caching from "./caching";
import * as crud from "./crud";
import { BatchingController } from "./batching";
import { getUpdatedAt, isValidRef } from "./helpers/fields";
import { CrudPacket } from "@owl-factory/types/object";
import { getUniques } from "@owl-factory/utilities/arrays";
import { getSuccessfulDocuments } from "./helpers/data";
import { action, makeObservable, observable } from "mobx";
import { Cacheable } from "@owl-factory/cache/decorators";

/**
 * The top level Data Managing class with an API for accessing and searching data
 */
export class DataManager<T extends Record<string, unknown>> {
  protected collection = "data"; // The name of the data collection. Used for logs and caching

  public lastTouched = 0;

  // Configuration //
  public url = "/";
  public reloadPolicy = ReloadPolicy.IfStale;
  public staleTime = 30 * 60 * 1000;

  // Subcomponents //
  public batching: BatchingController;
  public data: DataController<T>;
  public grouping: GroupingController<T>;

  constructor(url: string) {
    this.url = url;

    this.data = new DataController(this.staleTime);
    this.grouping = new GroupingController();
    this.batching = new BatchingController((refs) => this.cacheAction(refs), 5000);
  }

  /**
   * Fetches a single document
   * @param ref The reference to the desired document
   * @returns The document, if found. Undefined otherwise
   */
  public get(ref: Ref64 | null | undefined): T | undefined {
    if (!ref || ref === "undefined" || ref === null) { return undefined; }
    const packet = this.data.get(ref);
    if (!packet) { return undefined; }
    return packet.doc;
  }

  /**
   * Fetches multiple documents
   * @param refs The references to the desired documents
   * @returns An array of documents
   */
  public getMany(refs: Ref64[]): T[] {
    const packets = this.data.getMany(refs);
    const docs: T[] = [];
    for (const packet of packets) { docs.push(packet.doc); }
    return docs;
  }

  /**
   * Saves a document locally
   * @param doc The document to save
   * @param loaded Indicates that the document is loaded. Defaults to false
   * @returns True if the document was saved successfully, false otherwise
   */
  public set(doc: T, loaded = false): boolean {
    const ref = doc.ref as string;
    const updatedAt = getUpdatedAt(doc);

    // Ref check! We can't save if there's no ref
    if (!isValidRef(ref)) {
      console.error(`A document attempting to be added to the ${this.collection} data manager is missing a ref.`);
      return false;
    }
    const oldPacket = this.data.get(ref);
    const metadata = newMetadata(loaded, updatedAt);
    const packet = newPacket(doc, metadata) as Packet<T>;

    const savedPacket = this.data.set(packet);
    this.batching.addToCacheQueue(ref);

    // Update in groups
    if (oldPacket !== undefined) { this.grouping.onUpdatedDoc(savedPacket.doc, oldPacket.doc); }
    else { this.grouping.onNewDoc(savedPacket.doc); }

    this.touch();

    return true;
  }

  /**
   * Saves a number of documents locally
   * @param docs A list of documents to save
   * @returns The number of documents successfully saved
   */
  public setMany(docs: T[], loaded = false): number {
    console.log(docs)
    let successCount = 0;
    for (const doc of docs) {
      const result = this.set(doc, loaded);
      if (result) { successCount++; }
    }

    return successCount;
  }

  /**
   * Loads one or many documents from the database
   * @param targetRefs The refs to load from the database
   */
  public async load(targetRefs: Ref64[] | Ref64 | null, reloadPolicy?: ReloadPolicy): Promise<void> {
    if (targetRefs === null) { return; }
    const refs = Array.isArray(targetRefs) ? targetRefs : [targetRefs];
    const loadedDocs = await this.data.load(
      refs,
      reloadPolicy || this.reloadPolicy,
      (readRefs: string[]) => this.read(readRefs)
    );
    this.setMany(loadedDocs, true);

    // Other caching and saving are handled in setMany

    return;
  }

  /**
   * Clears all data. For use when a user logs out or in
   */
  public clear(): void {
    this.data.clear();
    caching.clear(this.collection);
    this.grouping.clear();
    return;
  }

  /**
   * Removes a single document from the local data stores. Does not remove it from the database
   * @param ref Removes a single document
   * @returns The number of documents removed
   */
  public remove(ref: Ref64): number {
    const deletedPacket = this.data.remove(ref);
    if (!deletedPacket) { return 0; }

    this.batching.addToCacheQueue(ref);

    // Remove in searching
    this.grouping.onRemoveDoc(deletedPacket.doc);
    return 1;
  }

  /**
   * Removes the documents with the given refs from the data
   * @param refs A list of refs for documents to remove
   * @returns The number of documents deleted
   */
  public removeMany(refs: Ref64[]): number {
    let totalDeleteCount = 0;
    for (const ref of refs) {
      const deleteCount = this.remove(ref);
      totalDeleteCount += deleteCount;
    }
    return totalDeleteCount;
  }

  /**
   * Searches for refs matching the given parameters
   * @param parameters The search parameters describing what we're searching for
   * @returns A list of refs matching the search criteria
   */
  public search(parameters: SearchParams = {}): Ref64[] {
    let refs: Ref64[] = [];
    if (parameters.group === "data" || !parameters.group) { refs = this.data.getRefs(); }
    else { refs = this.grouping.getGroup(parameters.group || ""); }
    return refs;
  }

  /**
   * Marks the Data Manager as having been changed to allow for updates through MobX
   */
  public touch(): void {
    this.lastTouched = Date.now();
  }

  public isLoaded(ref?: Ref64): boolean {
    if (!ref) { return false; }
    const packet = this.data.get(ref);
    if (!packet) { return false; }
    return packet.meta.loaded;
  }

  /**
   * Adds a single grouping of documents
   * @param name The name of the group to add
   * @param validation A validation function that determines if a document belongs to the group.
   *  Takes a document and returns a boolean
   */
  public addGroup(name: string, validation: (doc: T) => boolean) {
    const allData = this.data.getAll();
    this.grouping.addGroup(name, validation, allData);
  }

  /**
   * Removes a single grouping of documents
   * @param name The name of the group to remove
   * @returns The number of groups deleted
   */
  public removeGroup(name: string): number {
    return this.grouping.removeGroup(name);
  }

  /**
   * Runs the action to update a number of items in the cache
   * TODO - please rename. This is weird
   * @param refs The refs to update in the cache
   */
  public cacheAction(refs: Ref64[]): void {
    for (const ref of refs) {
      const packet = this.data.get(ref);
      if (!packet) {
        caching.remove(this.collection, ref);
        continue;
      }
      caching.set(this.collection, packet);
    }

    caching.setRefs(this.collection, this.data.getRefs());
  }

  /**
   * Creates one or many documents and ensures that they're loaded into the DataManager
   * @param docs The documents to create
   * @returns A list of packets, for for each document, returning the created document or an error message
   */
  @Cacheable()
  public async $create(docs: T | T[]): Promise<CrudPacket<T>[]> {
    if (!Array.isArray(docs)) { docs = [docs]; }

    const packets = await crud.create<T>(this.url, docs);
    const createdDocs = getSuccessfulDocuments(packets);
    this.setMany(createdDocs);
    return packets;
  }

  /**
   * Creates one or many documents and ensures that they're loaded into the DataManager
   * @param docs The documents to create
   * @returns A list of packets, for for each document, returning the created document or an error message
   */
   @Cacheable()
   public async read(refs: Ref64 | Ref64[]): Promise<CrudPacket<T>[]> {
    if (!Array.isArray(refs)) { refs = [refs]; }

    const packets = await crud.read<T>(this.url, refs);
    const createdDocs = getSuccessfulDocuments(packets);
    this.setMany(createdDocs);
    return packets;
  }

  /**
   * Creates one or many documents and ensures that they're loaded into the DataManager
   * @param docs The documents to create
   * @returns A list of packets, for for each document, returning the created document or an error message
   */
  // @Cacheable()
  public async $update(docs: T | T[]): Promise<CrudPacket<T>[]> {
    if (!Array.isArray(docs)) { docs = [docs]; }

    const packets = await crud.update<T>(this.url, docs);
    const createdDocs = getSuccessfulDocuments(packets);
    this.setMany(createdDocs);
    return packets;
  }

  /**
   * Creates one or many documents and ensures that they're loaded into the DataManager
   * @param docs The documents to create
   * @returns A list of packets, for for each document, returning the created document or an error message
   */
  // @Cacheable()
  public async delete(refs: Ref64 | Ref64[]): Promise<CrudPacket<T>[]> {
    if (!Array.isArray(refs)) { refs = [refs]; }

    const packets = await crud.del<T>(this.url, refs);
    const deletedDocs = getSuccessfulDocuments(packets);
    const deletedRefs = getUniques(deletedDocs, "ref");
    this.removeMany(deletedRefs);
    return packets;
  }

  /**
   * Creates one or many documents and ensures that they're loaded into the DataManager
   * @param docs The documents to create
   * @returns A list of packets, for for each document, returning the created document or an error message
   */
  @Cacheable()
  public async searchIndex(url: string, terms?: Record<string, string | number | boolean>): Promise<any> {
    const packets = await crud.search<T>(url, terms);
    this.setMany(packets);
    return packets;
  }
}

