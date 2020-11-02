import { ReturnModelType } from "@typegoose/typegoose";
import { Options } from "@reroll/model/dist/inputs/Options";
import { Query } from "mongoose";
import { validate } from "class-validator";
import { getUserID } from "../utilities/misc";
import { isID } from "../utilities/resolverHelpers";
import { GameSystemModel } from "@reroll/model/dist/documents/GameSystem";

// Contains any aliases that might be passed in to findByAlias for any super document
// TODO - move to a new file
interface SuperDocumentAliases {
  gameSystemID?: string;
}

type possibleSuperDocuments = keyof SuperDocumentAliases;

const superDocumentAliasModels: any = {
  gameSystemID: GameSystemModel
}

export class CoreResolver {
  // The Typegoose model for running all core requests
  protected model: ReturnModelType<any>;

  /**
   * Finds a document by an alias or id and optionally the aliases/ids of other documents
   * @param alias The alias or ID of the document to find
   * @param superDocumentAliases The aliases of any owning documents that the target document must belong to
   */
  protected findByAlias(alias: string, superDocumentAliases?: SuperDocumentAliases) {
    return this._findByAlias(alias, this.model, superDocumentAliases);
  }

  /**
   * Finds a collection of documents matching the given filters and options
   * 
   * @param filters Filters given to find specific documents
   * @param options General options for modifying results, such as length and how many to skip
   */
  protected findMany(filters?: any, options?: Options): Query<any> {
    return buildWhere(this.model.find({}, null, options), filters);
  }

  /**
   * Finds the count for the given filters
   * @param filters Filters used for determining what is counted
   */
  protected findCount(filters?: any) {
    return buildWhere(this.model.countDocuments({}), filters);
  }

  /**
   * Creates a single new document and inserts it into the database
   * @param data The data to insert into a new document
   * @param options Any additional options to save the data
   */
  protected async createOne(data: any) {
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

    return this.model.createOne(data);
  }

  /**
   * Updates a single document in the database
   * @param _id The id of the document to update
   * @param data The new data of the document to set
   */
  protected async updateOne(_id: string, data: any) {
    const errors = await validate(data);
    if (errors.length > 0) {
      throw new Error(errors.toString());
    }

    data.updatedAt = new Date();
    data.updatedBy = getUserID();

    return this.model.updateOne({_id}, data);
  }

  /**
   * Hard deletes a single document
   * @param _id The id of the document to delete
   */
  protected async deleteOne(_id: string) {
    return this.model.deleteOne({_id});
  }


  /**
   * A recursive function for finding by the alias or id. Recursion is for handling the super documents. 
   * The recursion should only go two levels deep at any given time. 
   * 
   * @param alias The alias or ID of the document to find
   * @param model The model to search through for our documents
   * @param superDocumentAliases A possible collection of aliases that may be given for sub-documents
   */
  private async _findByAlias(alias: string, model: ReturnModelType<any>, superDocumentAliases?: any) {
    // The search filters, to be used by the buildWhere function
    const filters: any = {};

    // Determines which filter we should use for finding by id or alias
    if (isID(alias)) {
      filters._id_eq = alias;
    } else {
      filters.alias_eq = alias;
    }

    // Fetch early if we don't need to worry about super document aliases
    if (!superDocumentAliases) { return buildWhere(model.findOne({}, null), filters); }

    // Get super document ids
    const superDocuments: string[] = Object.keys(superDocumentAliases);

    // We use a for loop over for each so we can easily return out
    for (let i = 0; i < superDocuments.length; i++) {
      const superDocument = superDocuments[i];
      // Catch case for typescripting
      if (!(superDocument in superDocumentAliases)) { 
        throw Error("Invalid super document alias")
      }

      // TODO - this function has weird typing. We need to change the any in the superDocumentAliases
      // and superDocumentAliasModels into specifically typed types
      const superDocumentResult = await this._findByAlias(
        superDocumentAliases[superDocument],
        superDocumentAliasModels[superDocument]
      );

      if (!superDocumentResult) { return null; }

      filters[`${superDocument}_eq`] = superDocumentResult._id;
    }

    return buildWhere(model.findOne({}, null), filters);
  }

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