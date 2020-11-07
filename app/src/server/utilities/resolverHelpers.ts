import { GameSystemModel } from "@reroll/model/dist/documents/GameSystem";
import { Query } from "mongoose";

/**
 * Finds the id of a document given an id or a unique alias, then returns the 
 * ID and the validity. 
 * 
 * @param model The mongoose model to fetch the id for based on the id/alias
 * @param alias The id/alias of the document to find
 */
async function fetchDocumentID(model: any, alias: string): Promise<[string | undefined, boolean]>  {
  if (alias && !isID(alias)) {
    const document = await model.findOne().where("alias").equals(alias);
    if (!document) {
      return [undefined, false];
    }

    return [document._id, true];
  }

  return [alias, true];
}

/**
 * Finds the ID of the game system, if given an id or alias, 
 * and returns the ID and validity
 * 
 * @param gameSystemID The id/alias of the gamesystem to find the ID of
 */
export async function fetchGameSystemID(gameSystemID: string | undefined): Promise<[string | undefined, boolean]> {
  if (!gameSystemID) { return [undefined, false]; }
  return await fetchDocumentID(GameSystemModel, gameSystemID);
}

/**
 * A function for testing of IDs in the event we expand our definition of IDs
 * @param id The string to check for ID-ness
 */
export function isID(id: string) {
  return id.length === 24
}

function applyFilterObject(query: Query<any>, filters: any) {
  const filterKeys = Object.keys(filters).sort();
  let lastUsedVariable = "";

  filterKeys.forEach((filterKey: string) => {
    // Grab variable
    const filterComponents = filterKey.match(/(\S*)_([^_\s]+)/i);
    if (filterComponents === null) {
      throw new Error("An invalid filter variable was provided");
    }
    const variableName = filterComponents[1];
    const whereCondition = filterComponents[2];

    if (lastUsedVariable !== variableName) {
      lastUsedVariable = variableName;
      query = query.where(variableName);
    }

    switch(whereCondition) {
      case "eq": 
        query = query.equals(filters[filterKey]);
        break;
      case "gt":
        query = query.gt(filters[filterKey]);
        break;
      case "gte":
        query = query.gte(filters[filterKey]);
        break;
      case "in":
        query = query.in(filters[filterKey]);
        break;
      case "like": 
        query = query.regex(new RegExp(filters[filterKey], "i"));
        break;
      case "gte":
        query = query.gte(filters[filterKey]);
        break;
      case "lt":
        query = query.lt(filters[filterKey]);
        break;
      case "lte":
        query = query.lte(filters[filterKey]);
        break;
      case "ne":
        query = query.ne(filters[filterKey]);
        break;
      
    }
  });

  return query;
}

/**
 * Builds and adds a where clause to a query given the filters 
 * 
 * TODO - move to a new file?
 * 
 * @param query The query object to add where clauses upon
 * @param filters The filters to convert into a where clause for the query
 */
export function applyFilters(query: Query<any>, filters: any[]): Query<any> {
  // TODO - modify functionality such that this takes in either an object or an array, with each array splitting
  // up with an OR
  // Alternatively, we can use mongoose-adjacent filters which would be GREAT because we don't need processing, 
  // we can just pass through the array or struct object
  // Exit early if no filters given
  if (!filters) {
    return query;
  }

  return query;
}