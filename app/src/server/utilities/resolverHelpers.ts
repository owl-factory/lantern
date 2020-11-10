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

/**
 * A recursive function for parsing out nested fields into a single level of Mongoose compatible filters
 * 
 * @param filterObject An object that is sent diectly from GQL
 * @param baseKey The key to prepend to any new filter
 */
export function parseFilter(filterObject: any, baseKey: string = "") {
  const fieldKeys = Object.keys(filterObject);
  const parsedFilters: any = {};

  fieldKeys.forEach((fieldKey: string) => {
    if (fieldKey === "or") { return; }

    const field = filterObject[fieldKey];
    // EQ and like are special cases that return strings, not objects
    const filterKeys = Object.keys(field);
    if ("eq" in field) {
      parsedFilters[baseKey + fieldKey] = field.eq;
      return;
    }

    else if ("like" in field) {
      parsedFilters[baseKey + fieldKey] = new RegExp(field.like, 'i');
      return;
    }

    const filterSubobject: any = {};
    let addFilter = false;
    filterKeys.forEach((filterKey: string) => {
      switch(filterKey) {
        case "neq":
        case "lte":
        case "lt":
        case "gt":
        case "gte":
          filterSubobject[`$${filterKey}`] = field[filterKey];
          addFilter = true;
          break;
        default: 
          // Merge parsed Fields with new parsed fields
          const subFields = parseFilter(field, `${fieldKey}.`);
          const subFieldKeys = Object.keys(subFields);
          subFieldKeys.forEach((subFieldKey: string) => {
            parsedFilters[subFieldKey] = subFields[subFieldKey];
          });
          return;
      }
    });
    if (addFilter) {
      parsedFilters[baseKey + fieldKey] = filterSubobject;
    }
  });
  return parsedFilters;
}

/**
 * Builds and adds a where clause to a query given the filters 
 * 
 * @param filters The filters to convert into an or clause for the query
 */
export function buildFilters(filters: any): any {
  if (!filters) { return {}; }
  let andFilters: any = undefined;
  let orFilters: any = undefined;

  if ("or" in filters && filters.or.length) {
    orFilters = [];
    filters.or.forEach((filterOr: any) => {
      orFilters.push(parseFilter(filterOr))
    });
  }

  const filterKeys = Object.keys(filters);
  // Ensures we have at least one non-or key
  if (filterKeys.length >= 2 || (filterKeys.length == 1 && !("or" in filters))) {
    andFilters = parseFilter(filters);
  }

  if (!orFilters) { return andFilters; }
  if (!andFilters) { return { $or: orFilters }; }
  
  return {$and: [
    andFilters,
    { $or: orFilters }
  ]};
}