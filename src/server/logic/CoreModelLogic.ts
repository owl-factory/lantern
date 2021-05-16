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
      item.forEach((value: (string | number | unknown), i: number) => {
        const valueKey = values[i];
        parsedItem[valueKey] = value;

        if(valueKey === "ref") {
          const { id, collection } = parseRef(value);
          parsedItem.id = id;
          parsedItem.collection = collection;
        }
      });
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
function FaunaTime(arg0: Date): any {
  throw new Error("Function not implemented.");
}

