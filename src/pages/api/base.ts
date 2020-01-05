import { isArray } from "util";

export function defaultResponse() {
  return {
    "success": true,
    "message": "Data pulled successfully.",
    "data": {},
    "count": 0,
    "total": 0,
  };
}

/**
 * Searches through an array for data. Returns a standard response
 * @param data An array of objects to parse through
 * @param query An array of objects for searching. All fields in a struct must
 *  match, with each struct delimited by an or
 * @param list If the result should be a list or a single item
 */
export function search(data: any, query: object|object[], list: boolean = true) {
  const output: any = defaultResponse();
  let queryOrs: object[] = [];

  output.data = [];

  if (!isArray(query)) {
    queryOrs = [query];
  } else {
    queryOrs = query;
  }

  data.forEach((item: any) => {
    queryOrs.forEach((queryAnd: any) => {
      let queryMatches: boolean = true;
      for (const key in queryAnd) {
        if (item[key] == null) {
          queryMatches = false;
          continue;
        } else if (item[key] !== queryAnd[key]) {
          queryMatches = false;
        }
      }

      // If the and statement works, add this item to  the output and exit to next item
      if (queryMatches === true) {
        output.data.push(item);
        return;
      }
    });
  });

  if (list === false) {
    if (output.data.length === 0) {
      output.data = {};
      output.count = 0;
      output.total = 0;
      return output;
    }
    output.data = output.data[0];
    output.count = 1;
    output.total = 1;
    return output;
  }

  output.count = output.data.length;
  output.total = output.data.length + 1;
  return output;
}