import { ReturnModelType } from "@typegoose/typegoose";
import { Options } from "@reroll/model/src/inputs/Options";
import { Query } from "mongoose";
import { validate } from "class-validator";
import { getUserID } from "../misc";

export class CoreResolver {
  protected model: ReturnModelType<any>;

  /**
   * Search for a single document with the given id/alias and additional ids
   * @param _id The id or alias of the document to find
   * @param filters A collection of additional IDs provided for non-unique aliases
   */
  resolver(_id: string, filters: any = {}) {
    // Removes any empty ids from the filters
    for(const filter in filters) {
      if (!filters[filter] ) {
        delete filters[filter];
      }
    }

    // Determines which filter we should use
    if (isID(_id)) {
      filters._id_eq = _id;
    } else {
      filters.alias_eq = _id;
    }

    return buildWhere(this.model.findOne({}, null), filters);
  }
  
  /**
   * Finds up to fifty items matching the filters and the options
   * 
   * @param filters Object that filters the returned data to match
   * @param options Options that change how what is found is returned
   */
  resolvers(filters?: any, options?: Options): Query<any> {
    return buildWhere(this.model.find({}, null, options), filters);
  }

  /**
   * Returns a count for a resolver 
   * @param filters On object that filters out what should be counted
   */
  resolverCount(filters?: any) {
    const result = buildWhere(this.model.countDocuments({}), filters);
    return result;
  }

  /**
   * Valdiates and creates a new object from the given data
   * 
   * @param data The data to save into the model
   */
  async newResolver(data: any, options?: any) {
    const errors = await validate(data);
    if (errors.length > 0) {
      throw new Error(errors.toString());
    }

    // Updates both so we can track when something was last created and when 
    // it was last touched easier
    data.createdAt = new Date();
    data.createdBy = getUserID();

    data.updatedAt = new Date();
    data.updatedBy = getUserID();

    const result = await this.model.create([data], options);
    return result[0];
  }

  /**
   * Validates and updates a single document
   * 
   * @param _id The id of the document to update
   * @param data The data to change in the document
   */
  async updateResolver(_id: string, data: any, options?: any) {
    const errors = await validate(data);
    if (errors.length > 0) {
      throw new Error(errors.toString());
    }

    data.updatedAt = new Date();
    data.updatedBy = getUserID();

    return this.model.updateOne({_id}, data);
  }

  /**
   * Updates multiple documents based on filters 
   * 
   * @param filters Object that filters what data is updated
   * @param options Options that change what's updated
   */
  async updateResolvers(data: any, filters?: any) {
    const errors = await validate(data);
    if (errors.length > 0) {
      throw new Error(errors.toString());
    }

    data.updatedAt = new Date();
    data.updatedBy = getUserID();
    
    return buildWhere(this.model.updateMany({}, data), filters);
  }

  /**
   * Deletes a single document by id
   * 
   * @param _id The ID of the document to delete
   */
  deleteResolver(_id: string) {
    return this.model.deleteOne({_id});
  }

  /**
   * Deletes multiple documents
   * @param filters An object the filtrs out what is deleted
   */
  deleteResolvers(filters?: any, options?: Options) {
    return buildWhere(this.model.deleteMany({}, options), filters);
  }
}

/**
 * A function for testing of IDs in the event we expand our definition of IDs
 * @param id The string to check for ID-ness
 */
export function isID(id: string) {
  return id.length === 24
}

/**
 * TODO - flesh this out some
 * @param givenAliasDependencies 
 * @param requiredAliasDependencies 
 */
function hasRequiredDependencies(
  givenAliasDependencies: any, 
  requiredAliasDependencies: string[]
) {
  let hasAllDependencies = true;
  requiredAliasDependencies.forEach((requiredDependency: string) => {
    hasAllDependencies = hasAllDependencies && requiredDependency in givenAliasDependencies;
  });
  return hasAllDependencies;
}

/**
 * Builds and adds a where clause to a query given the filters 
 * 
 * TODO - move to a new file?
 * 
 * @param query The query object to add where clauses upon
 * @param filters The filters to convert into a where clause for the query
 */
function buildWhere(query: Query<any>, filters: any): Query<any> {
  // Exit early if no filters given
  if (!filters) {
    return query;
  }

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