import { getServerClient } from "utilities/db";
import { Expr, query as q } from "faunadb";
import { isFaunaError, parseFaunaRef, toFauna, toFaunaDate, toFaunaRef } from "utilities/fauna";
import { FaunaRef } from "types/fauna";
import { UserDocument } from "types/documents";
type AnyDocument = any;

interface PaginationOptions {
  size: number;
}

interface IndexResponse {
  data?: (string | number | unknown)[][];
  error?: any;
}

interface RawDocument {
  ref?: Expr;
  data?: object;
  credentials?: Record<string, unknown>;
  delegates?: Record<string, unknown>;
  ts?: number;

}

interface MyUserDocument {
  id: string,
  ref: FaunaRef,
  roles: string[];
}
export class CoreModelLogic {
  public static isLoggedIn(myUser: UserDocument): boolean {
    if (!myUser || !myUser.id) { return false; }
    return true;
  }

  /**
   * Creates a single document
   * @param collection The collection to save a new document to
   * @param doc The raw Javascript-style document to save to the database
   * @param allowedFields The fields that we are allowing to be saved
   * @param myUser The current user who is creating the document
   */
  public static async createOne(
    collection: string,
    doc: RawDocument,
    allowedFields: string[],
    myUser: MyUserDocument,
  ): Promise<Record<string, unknown>> {

    const faunaDoc = toFauna(this.trimRestrictedFields(doc, allowedFields));
    const now = toFaunaDate(new Date());
    const currentUser = { ref: myUser.ref };

    faunaDoc.data.createdAt = now;
    faunaDoc.data.updatedAt = now;
    faunaDoc.data.ownedBy = currentUser;
    faunaDoc.data.createdBy = currentUser;
    faunaDoc.data.updatedBy = currentUser;

    const client = getServerClient();
    const result = await client.query(
      q.Create(collection, doc)
    );

    if (isFaunaError(result)) {
      throw { code: 500, status: "An error occurred while creating your document" };
    }

    return result as Record<string, unknown>;
  }


  public static async updateOne(
    ref: AnyDocument,
    doc: Record<string, unknown>,
    allowedFields: string[],
    myUser: MyUserDocument
  ) {
    const client = getServerClient();

    const faunaDoc = toFauna(this.trimRestrictedFields(doc, allowedFields));
    const now = toFaunaDate(new Date());
    const currentUser = { ref: myUser.ref };

    faunaDoc.data.updatedAt = now;
    faunaDoc.data.updatedBy = currentUser;


  }

  /**
   * Updates a single document in Fauna. If it fails, throw an error
   * @param ref The reference object to update
   * @param doc The partial document to update
   */
   public static async updateOnea(
    ref: FaunaRef | Expr,
    doc: Record<string, unknown>,
    myID: string,
  ): Promise<Record<string, unknown>> {
    const client = getServerClient();

    doc.updatedAt = new Date();
    doc.updatedBy = toFaunaRef(myID, "users");

    const savedDoc = await client.query(q.Update(ref, { data: doc })) as Record<string, unknown>;
    if (isFaunaError(savedDoc)) {
      throw { code: 500, status: "An error occured while updating your document" };
    }
    return savedDoc;
  }

  /**
   * Handles the shared code for fetching by an index and putting into documents
   * @param index The index to search through
   * @param terms The terms in order of usage encapsulated in an array
   * @param values The field names of the values, in the order they are returned
   * @param paginationOptions Options for paginaton, such as size
   */
  public static async fetchByIndex(
    index: string,
    terms: (string | Expr)[],
    values: string[],
    paginationOptions: PaginationOptions
  ): Promise<any[]> {
    const client = getServerClient();

    const result: IndexResponse = await client.query(
      q.Paginate(
        q.Match(q.Index(index), terms),
        paginationOptions
      ),
    );

    // TODO - proper error message
    if (!result.data) {
      throw "ERROR";
    }

    const parsedResult: any[] = [];

    result.data.forEach((item: (string | number | unknown)[]) => {
      const parsedItem: Record<string, unknown> = {};

      if (!Array.isArray(item)) {
        const { id, collection } = parseFaunaRef(item);
        parsedItem.ref = item;
        parsedItem.id = id;
        parsedItem.collection = collection;
      } else {
        item.forEach((value: (string | number | unknown), i: number) => {
          const valueKey = values[i];
          parsedItem[valueKey] = value;

          if(valueKey === "ref") {
            const { id, collection } = parseFaunaRef(value);
            parsedItem.id = id;
            parsedItem.collection = collection;
          }
        });
      }
      parsedResult.push(parsedItem);
    });

    return parsedResult;
  }


  /**
   * Trims the given document to only have the given fields. All others are discarded.
   * @param doc The document to trim
   * @param givenAllowedFields The given fields to keep, if any
   * @returns A subset object of the given document
   */
  public static trimRestrictedFields(
    doc: any,
    givenAllowedFields: string[]
  ): any {
    const allowedFields = [
      "id", "collection", "ref", "ts", "name", "createdAt", "updatedAt", "ownedBy", "createdBy", "updatedBy",
    ].concat(givenAllowedFields);

    const newDoc: any = {};
    allowedFields.forEach((allowedField: string) => {
      if (!(allowedField in doc)) { return; }
      newDoc[allowedField] = doc[allowedField];
    });

    return newDoc;
  }
}

