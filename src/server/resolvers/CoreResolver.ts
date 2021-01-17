import { ReturnModelType } from "@typegoose/typegoose";
import { validate } from "class-validator";
import { CoreDocument, GenericDocumentType } from "../../types/documents";
import { Options } from "../../types/inputs/options";
import { CreateOneResponse, FindManyResponse } from "../../types/resolvers";
import { Context } from "../../types/server";
import { buildFilters } from "../utilities/resolvers";


export default class CoreResolver {
  public static model: ReturnModelType<any>;

  /**
   * Finds a collection of documents matching the given filters and options
   * @param ctx The context of the request and response, including the user's session
   * @param filters Filters given to find specific documents
   * @param options General options for modifying results, such as length and how many to skip
   */
  public static findMany(filters?: any, options?: Options, ctx?: Context): FindManyResponse<GenericDocumentType> {
    console.log(options)
    const mongooseFilters = buildFilters(filters);
    console.log(mongooseFilters)
    return this.model.find(mongooseFilters, null, options);
  }

  public static async createOne(data: CoreDocument, ctx?: Context): Promise<CreateOneResponse<GenericDocumentType>> {
    const errors = await validate(data);
    if (errors.length > 0) {
      throw new Error(errors.toString());
    }

    // Updates both so we can track when something was last created and when
    // it was last touched easier
    data.createdAt = new Date();
    data.createdBy = "1";
    // data.createdBy = getUserID();

    data.updatedAt = new Date();
    data.updatedBy = "1";
    // data.updatedBy = getUserID();

    return this.model.create(data);
  }
}