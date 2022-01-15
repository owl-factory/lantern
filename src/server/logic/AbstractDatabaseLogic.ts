import { Create, Delete, Fetch, Update } from "@owl-factory/database/decorators/crud";
import { Access, ReadFields, RequireLogin, SetFields } from "@owl-factory/database/decorators/modifiers";
import { Collection } from "src/fauna";
import { Ref64 } from "@owl-factory/types";
import * as fauna from "@owl-factory/database/integration/fauna";
import { isOwner } from "./security";
import { UserRole } from "@owl-factory/auth/enums";

/**
 * Defines the core functionality that can remain consistent between different implementations of the API logic
 */
export abstract class DatabaseLogic<T> {
  public abstract collection: Collection;

  /**
   * Creates a single document
   * @param doc The document to create
   * @returns The created document, if successful
   */
   @Create
   @Access({[UserRole.User]: true})
   @ReadFields(["*"])
   @SetFields(["*"])
   public async createOne(doc: Partial<T>): Promise<T> {
    const createdDoc = await fauna.createOne<T>(this.collection, doc);
    if (createdDoc === undefined) {
      throw { code: 500, message: `The campaign could not be created.`};
    }
    return createdDoc;
  }

   /**
    * Deletes a single document, if present
    * @param ref The ref of the document to delete
    * @returns The deleted document
    */
   @Delete
   @Access({[UserRole.User]: isOwner})
   public async deleteOne(ref: Ref64) {
    const deletedDoc = await fauna.deleteOne<T>(ref);
    if (deletedDoc === undefined) { throw { code: 404, message: `The document with id ${ref} could not be found.`}; }
    return deletedDoc;
  }

  /**
   * Fetches one campaign from its ID
   * @param id The Ref64 ID of the document to fetch
   * @returns The campaign document
   */
  @Fetch
  @Access({[UserRole.Guest]: true})
  @RequireLogin()
  @ReadFields(["*"])
  public async findOne(id: Ref64): Promise<T> {
    const readDoc = await fauna.findByID<T>(id);
    if (readDoc === undefined) { throw { code: 404, message: `A document with ID ${id} could not be found` }; }
    return readDoc;
  }

  /**
   * Updates a single document
   * @param ref The ref of the document to update
   * @param doc The changes in the document to patch on
   * @returns The updated document
   */
  @Update
  @Access({[UserRole.User]: isOwner, [UserRole.Admin]: true})
  @ReadFields(["*"])
  @SetFields(["*"])
  public async updateOne(ref: Ref64, doc: Partial<T>) {
    const updatedDoc = await fauna.updateOne(ref, doc);
    // TODO - better message
    if (updatedDoc === undefined) { throw { code: 404, message: `The document with id ${ref} could not be found.`}; }
    return updatedDoc;
  }

  /**
   * Creates many character documents
   * @param docs The documents to create
   * @returns The created documents
   */
   public async createMany(docs: Partial<T>[]) {
    const promises: Promise<Partial<T>>[] = [];

    docs.forEach((doc: Partial<T>) => {
      if (this.createOne === undefined) { return; }
      const promise = this.createOne(doc);
      promises.push(promise);
    });

    const createdDocs = await Promise.all(promises);
    return createdDocs;
  }

  /**
   * Deletes many documents
   * @param docs The documents to delete
   * @returns The deleted documents
   */
   public async deleteMany(refs: Ref64[]) {
    const promises: Promise<Partial<T>>[] = [];
    refs.forEach((ref: Ref64) => {
      if (this.deleteOne === undefined) { return; }
      promises.push(this.deleteOne(ref));
    });
    const deletedDocs = Promise.all(promises);
    return deletedDocs;
  }

  /**
   * Finds many documents
   * @param refs A list of document refs to fetch
   * @returns An array of found documents
   */
  public async findMany(refs: Ref64[]) {
    const promises: Promise<Partial<T>>[] = [];
    refs.forEach((ref: Ref64) => {
      if (this.findOne === undefined) { return; }
      promises.push(this.findOne(ref));
    });
    const readDocs = await Promise.all(promises);
    return readDocs;
  }

  /**
   * Updates one or many documents
   * @param packets Packets consisting of a ref and the partial document with changes to save
   * @returns An array of all updated documents
   */
  public async updateMany(packets: UpdatePacket<T>[]) {
    const promises: Promise<Partial<T>>[] = [];
    packets.forEach((packet: UpdatePacket<T>) => {
      if (this.updateOne === undefined) { return; }
      promises.push(this.updateOne(packet.ref, packet.doc));
    });

    const updatedDocs = await Promise.all(promises);
    return updatedDocs;
  }
}

interface UpdatePacket<T> {
  ref: Ref64;
  doc: Partial<T>;
}
