import { ReturnModelType } from "@typegoose/typegoose";
import { validate } from "class-validator";
import { Query } from "mongoose";
import { GenericModelType, RulesetModel } from "..";
import { GenericDocumentType } from "../../types/documents";
import { Options } from "../../types/inputs/options";
import { CreateOneResponse, FindCountResponse, FindManyResponse, FindOneResponse } from "../../types/resolvers";
import { Context } from "../../types/server";
import { buildFilters, isID } from "../utilities/resolvers";

type UpdateOneResponse = any;

// Contains any aliases that might be passed in to findByAlias for any super document
// TODO - move to a new file
interface SuperDocumentAliases {
  rulesetID?: string;
}

// The aliases to super document models.
const superDocumentAliasModels: Record<keyof SuperDocumentAliases, GenericModelType> = {
  rulesetID: RulesetModel,
};

/**
 * The core functionality for fetching, creating, updating, and deleting data. 
 */
export class CoreResolver {
  public static model: ReturnModelType<any>; // The mongoose model for fetching data

  /**
   * Finds a document by an alias or id and optionally the aliases/ids of other documents
   * @param ctx The context of the request and response, including the user's session
   * @param alias The alias or ID of the document to find
   * @param superDocumentAliases The aliases of any owning documents that the target document must belong to
   */
  public static findOne(
    alias: string,
    superDocumentAliases?: SuperDocumentAliases,
    ctx?: Context
  ): FindOneResponse<GenericDocumentType> {
    return this._findByAlias(alias, this.model, superDocumentAliases);
  }

  /**
   * Finds a collection of documents matching the given filters and options
   * @param ctx The context of the request and response, including the user's session
   * @param filters Filters given to find specific documents
   * @param options General options for modifying results, such as length and how many to skip
   */
  public static findMany(filters?: any, options?: Options, ctx?: Context): FindManyResponse<GenericDocumentType> {
    const mongooseFilters = buildFilters(filters);
    return this.model.find(mongooseFilters, null, options);
  }

    /**
   * Finds the count for the given filters
   * @param ctx The context of the request and response, including the user's session
   * @param filters Filters used for determining what is counted
   */
  public static findCount(filters?: any, ctx?: Context): FindCountResponse {
    const mongooseFilters = buildFilters(filters);
    return this.model.countDocuments(mongooseFilters);
  }

  /**
   * Creates a single new document and inserts it into the database
   * @param ctx The context of the request and response, including the user's session
   * @param data The data to insert into a new document
   * @param options Any additional options to save the data
   */
  public static async createOne(
    input: Record<string, unknown>,
    ctx?: Context
  ): Promise<CreateOneResponse<GenericDocumentType>> {
    console.log("Hi")
    const errors = await validate(input);
    if (errors.length > 0) {
      console.log(errors)
      throw new Error(errors.toString());
    }
    console.log("Validate finishes")
    // Updates both so we can track when something was last created and when
    // it was last touched easier
    input.createdAt = new Date();
    input.createdBy = "1";
    // data.createdBy = getUserID();

    input.updatedAt = new Date();
    input.updatedBy = "1";
    // data.updatedBy = getUserID();
    console.log(input)
    return this.model.create(input);
  }

  /**
   * Updates a single document in the database
   * @param ctx The context of the request and response, including the user's session
   * @param _id The id of the document to update
   * @param data The new data of the document to set
   */
  public static async updateOne(_id: string, data: Record<string, unknown>, ctx?: Context): Promise<UpdateOneResponse> {
    const errors = await validate(data);
    if (errors.length > 0) {
      throw new Error(errors.toString());
    }

    data.updatedAt = new Date();
    data.updatedBy = "1";

    return this.model.updateOne({_id}, data);
  }

  /**
   * Hard deletes a single document
   * @param ctx The context of the request and response, including the user's session
   * @param _id The id of the document to delete
   */
  public static async deleteOne(_id: string, ctx?: Context): Promise<any> {
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
  private static async _findByAlias(
    alias: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    model: ReturnModelType<any>, // Note: also needs to be any
    superDocumentAliases?: SuperDocumentAliases // TODO - properly type this
  ): Promise<Query<GenericDocumentType> | null> {
    // The search filters, to be used by the applyFilters function
    const filters: Record<string, unknown> = {};

    // Determines which filter we should use for finding by id or alias
    if (isID(alias)) {
      filters._id = { eq: alias };
    } else {
      filters.alias = { eq: alias };
    }

    // Fetch early if we don't need to worry about super document aliases
    if (!superDocumentAliases) { return model.findOne(buildFilters(filters), null); }

    // Get super document ids
    const superDocuments: string[] = Object.keys(superDocumentAliases);

    // We use a for loop over for each so we can easily return out
    for (let i = 0; i < superDocuments.length; i++) {
      const superDocument: string = superDocuments[i];
      // Catch case for typescripting
      if (!(superDocument in superDocumentAliases)) {
        throw Error("Invalid super document alias");
      }

      // TODO - this function has weird typing. We need to change the any in the superDocumentAliases
      // and superDocumentAliasModels into specifically typed types
      const superDocumentResult = await this._findByAlias(
        (superDocumentAliases as Record<string, string>)[superDocument],
        (superDocumentAliasModels as Record<string, unknown>)[superDocument]
      );

      if (!superDocumentResult) { return null; }

      filters[`${superDocument}ID`] = { eq: superDocumentResult._id as string };
    }

    return model.findOne(buildFilters(filters), null);
  }
}