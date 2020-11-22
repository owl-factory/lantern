/**
 * THIS IS A REFERENCE FILE ONLY FOR SAVING THE BASE RESOLVERS. MUST NOT BE USED IN ACTUAL PRODUCTION
 */

import { CoreDocument, AssetModel } from "@reroll/model/dist/documents";
import { DeleteResponse, UpdateResponse } from "@reroll/model/dist/models/graphQLResponses";
import { CoreFilter } from "@reroll/model/dist/filters";
import { CoreInput } from "@reroll/model/dist/inputs";
import { Options } from "@reroll/model/dist/inputs/Options";
import { Arg, Args, Authorized, Int, Mutation, Query, Resolver } from "type-graphql";
import { CoreResolver } from "./CoreResolver";
import { FindOneResponse, FindManyResponse, FindCountResponse, UpdateOneResponse, DeleteOneResponse, CreateOneResponse } from "../../types/resolvers";

/**
 * Resolves xxx queries
 */
@Resolver(CoreDocument)
export class SharedResolver extends CoreResolver {
  protected model = AssetModel;

  /**
   * Fetches a document matching the given id or aliases
   * @param _id The id or alias of the document to return
   */
  @Query(() => CoreDocument, { nullable: true })
  public xxx(@Arg("_id") _id: string): FindOneResponse<CoreDocument> {
    return super.findByAlias(_id) as FindOneResponse<CoreDocument>;
  }

  /**
   * Fetches the documents matching the filter and options
   */
  @Query(() => [CoreDocument])
  public xxxs(
    @Arg("filters", {nullable: true}) filters?: CoreFilter,
    @Args() options?: Options
  ): FindManyResponse<CoreDocument> {
    return super.findMany(filters, options) as FindManyResponse<CoreDocument>;
  }

  /**
   * Returns a count of all of the documents matching the given filters
   * @param filters The filter object to count documents by. Identical to other filters
   */
  @Query(() => Int)
  public xxxCount(@Arg("filters", {nullable: true}) filters?: CoreFilter): FindCountResponse {
    return super.findCount(filters);
  }

  /**
   * Inserts a new document into the database
   * @param data the data to insert into a new document
   */
  @Authorized()
  @Mutation(() => CoreDocument)
  public createXXX(@Arg("data") data: CoreInput): Promise<CreateOneResponse<CoreDocument>> {
    return super.createOne(data) as Promise<CreateOneResponse<CoreDocument>>;
  }

  /**
   * Updates a document with new data. Data not present will not be changed.
   * @param _id The id of the document to update
   * @param data The new data to upsert into the document
   */
  @Authorized()
  @Mutation(() => UpdateResponse)
  public updateXXX(
    @Arg("_id") _id: string,
    @Arg("data") data: CoreInput
  ): Promise<UpdateOneResponse> {
    return super.updateOne(_id, data);
  }

  /**
   * Deletes a document
   * @param _id The id of the document to delete
   */
  @Authorized()
  @Mutation(() => DeleteResponse)
  public deleteXXX(@Arg("_id") _id: string): Promise<DeleteOneResponse> {
    return super.deleteOne(_id);
  }
}