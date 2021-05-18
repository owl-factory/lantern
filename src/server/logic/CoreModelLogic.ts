import { getServerClient } from "utilities/db";
import { Expr, Ref, query as q } from "faunadb";
import { parseRef } from "utilities/fauna";
import { FaunaRef } from "types/fauna";

interface PaginationOptions {
  size: number;
}

interface IndexResponse {
  data?: (string | number | unknown)[][];
  error?: any;
}

export class CoreModelLogic {
  /**
   * Builds a Ref using the ID and collection
   * @param id The id to build into a ref
   * @param collection The colelction to build into a ref
   * TODO - figure out how to avoid the extra Expr arguments
   */
  public static buildRef(id: string, collection: string): Expr {
    const ref: Expr = q.Ref(q.Collection(collection), id);

    return ref;
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
        const { id, collection } = parseRef(item);
        parsedItem.ref = item;
        parsedItem.id = id;
        parsedItem.collection = collection;
      } else {
        item.forEach((value: (string | number | unknown), i: number) => {
          const valueKey = values[i];
          parsedItem[valueKey] = value;

          if(valueKey === "ref") {
            const { id, collection } = parseRef(value);
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
   * Determine if the given document is a fauna error or not
   * @param doc The document to determine if an error or not.
   * TODO - create this
   * TODO - move to utilities/fauna
   */
  public static isFaunaError(doc: unknown): boolean {
    return false;
  }

  /**
   * Updates a single document in Fauna. If it fails, throw an error
   * @param ref The reference object to update
   * @param doc The partial document to update
   */
  public static async updateOne(ref: FaunaRef | Expr, doc: Record<string, unknown>): Promise<Record<string, unknown>> {
    const client = getServerClient();
    const savedDoc = await client.query(q.Update(ref, { data: doc })) as Record<string, unknown>;
    if (this.isFaunaError(savedDoc)) {
      throw { code: 500, status: "An error occured while updating your document" };
    }
    return savedDoc;
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

