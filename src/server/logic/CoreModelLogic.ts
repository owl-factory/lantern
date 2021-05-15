import { getServerClient } from "utilities/db";
import { Expr, query as q } from "faunadb";
import { parseRef } from "utilities/fauna";

interface PaginationOptions {
  size: number;
}

interface IndexResponse {
  data?: (string | number | unknown)[][];
  error?: any;
}

export class CoreModelLogic {
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

    console.log(parsedResult);
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
