import { ReturnModelType } from "@typegoose/typegoose";
import { Options } from "@reroll/model/dist/inputs/Options";
import { Query } from "mongoose";
import { validate } from "class-validator";
import { getUserID } from "../utilities/misc";
import { buildFilters, isID } from "../utilities/resolverHelpers";
import { GameSystemModel } from "@reroll/model/dist/documents/GameSystem";
import { CoreDocument } from "@reroll/model/dist/documents/CoreDocument";
import { GenericFiltersType } from "@reroll/model/dist/filters";
import { GenericDocumentType, GenericModelType } from "@reroll/model/dist/documents";
import { FindManyResponse, FindOneResponse, CreateOneResponse, FindCountResponse, UpdateOneResponse, DeleteOneResponse } from "../../types/resolvers";

// Contains any aliases that might be passed in to findByAlias for any super document
// TODO - move to a new file
interface SuperDocumentAliases {
  gameSystemID?: string;
}


const superDocumentAliasModels: Record<keyof SuperDocumentAliases, GenericModelType> = {
  gameSystemID: GameSystemModel
}

export class CoreResolver {
  // The Typegoose model for running all core requests
  // NOTE: Needs to be any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected model!: ReturnModelType<any>;

  /**
   * Finds a document by an alias or id and optionally the aliases/ids of other documents
   * @param alias The alias or ID of the document to find
   * @param superDocumentAliases The aliases of any owning documents that the target document must belong to
   */
  protected findByAlias(alias: string, superDocumentAliases?: SuperDocumentAliases): FindOneResponse<GenericDocumentType> {
    return this._findByAlias(alias, this.model, superDocumentAliases);
  }

  /**
   * Finds a collection of documents matching the given filters and options
   * 
   * @param filters Filters given to find specific documents
   * @param options General options for modifying results, such as length and how many to skip
   */
  protected findMany(filters?: GenericFiltersType, options?: Options): FindManyResponse<GenericDocumentType> {
    const mongooseFilters = buildFilters(filters);
    return this.model.find(mongooseFilters, null, options);
  }

  /**
   * Finds the count for the given filters
   * @param filters Filters used for determining what is counted
   */
  protected findCount(filters?: GenericFiltersType): FindCountResponse {
    const mongooseFilters = buildFilters(filters);
    return this.model.countDocuments(mongooseFilters);
  }

  /**
   * Creates a single new document and inserts it into the database
   * @param data The data to insert into a new document
   * @param options Any additional options to save the data
   */
  protected async createOne(data: CoreDocument): Promise<CreateOneResponse<GenericDocumentType>> {
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

    return this.model.create(data);
  }

  /**
   * Updates a single document in the database
   * @param _id The id of the document to update
   * @param data The new data of the document to set
   */
  protected async updateOne(_id: string, data: CoreDocument): Promise<UpdateOneResponse> {
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
  protected async deleteOne(_id: string): Promise<DeleteOneResponse> {
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
  private async _findByAlias(
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
        throw Error("Invalid super document alias")
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


