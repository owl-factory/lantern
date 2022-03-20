import { Ref64 } from "@owl-factory/types";
import { Collection } from "src/fauna";
import * as fauna from "@owl-factory/database/integration/fauna";

/**
 * Defines the core functionality that can remain consistent between different implementations of the API logic
 */
export abstract class DatabaseLogic<T> {
  public collection!: Collection;

  /**
   * Creates a document and ensures that it exists before returning. Otherwise throws an error.
   * @param doc The document to create
   * @returns The created document
   */
  public async create(doc: Partial<T>): Promise<T> {
    const newDoc = await fauna.createOne<T>(this.collection, doc);
    if (newDoc === undefined) {
      let name = "undefined";
      if ("name" in doc) { name = (doc as any).name; }
      throw `A document in collection '${this.collection}' with name '${name}' could not be created`;
    }
    return newDoc;
  }

  /**
   * Deletes and returns a document. Throws an error on failure.
   * @param ref The ref of the document to delete
   * @returns The deleted document
   */
  public async delete(ref: Ref64): Promise<T> {
    const deletedDoc = await fauna.deleteOne<T>(ref);
    if (deletedDoc === undefined) {
      throw `A document in collection '${this.collection}' with ref '${ref}' could not be deleted`;
    }
    return deletedDoc;
  }

  /**
   * Fetches and returns a document. Throws an error if the document was not found
   * @param ref The ref of the document to fetch
   * @returns The fetched document
   */
  public async fetch(ref: Ref64): Promise<T> {
    const doc = await fauna.findByID<T>(ref);
    if (doc === undefined) {
      throw `A document in collection '${this.collection}' with ref '${ref}' could not be found`;
    }
    return doc;
  }

  /**
   * Updates a document and returns the result. Throws an error if the document fails to update
   * @param ref The ref of the document to update
   * @param doc The changes to make in the document
   * @returns The full updated document
   */
  public async update(ref: Ref64, doc: Partial<T>): Promise<T> {
    const updatedDoc = await fauna.updateOne<T>(ref, doc);
    if (updatedDoc === undefined) {
      throw `A document in collection '${this.collection}' with ref '${ref}' could not be updated`;
    }
    return updatedDoc;
  }
}


