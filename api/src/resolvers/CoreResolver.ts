import { ReturnModelType } from "@typegoose/typegoose";
import { Options } from "@reroll/model/src/inputs/Options";
import { Query } from "mongoose";
import { UserInputError } from "apollo-server-express";
import { validate } from "class-validator";

export class CoreResolver {
  protected model: ReturnModelType<any>

  /**
   * Finds a single resolver by ID
   * 
   * @param _id The id of the model to find
   */
  resolver(_id: string) {
    return this.model.findById(_id);
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
   * Valdiates and creates a new object from the given data
   * 
   * @param data The data to save into the model
   */
  async newResolver(data: any) {
    const errors = await validate(data);
    if (errors.length > 0) {
      throw new Error(errors.toString());
    }

    return this.model.create(data);
  }

  /**
   * Validates and updates a single document
   * 
   * @param _id The id of the document to update
   * @param data The data to change in the document
   */
  async updateResolver(_id: string, data: any) {
    const errors = await validate(data);
    if (errors.length > 0) {
      throw new UserInputError(errors.toString());
    }

    // TODO - needs to return updated model
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
      throw new UserInputError(errors.toString());
    }
    
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
 * Builds and adds a where clause to a query given the filters 
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
      throw new UserInputError("An invalid filter variable was provided");
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
        query = query.regex(filters[filterKey]);
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