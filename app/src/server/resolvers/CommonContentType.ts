import { CommonContentType, CommonContentTypeModel } from "@reroll/model/dist/documents";
import { DeleteResponse, UpdateResponse } from "@reroll/model/dist/documents/Responses";
import { CommonContentTypeFilter } from "@reroll/model/dist/filters";
import { CreateCommonContentTypeInput, UpdateCommonContentTypeInput } from "@reroll/model/dist/inputs";
import { Options } from "@reroll/model/dist/inputs/Options";
import { Query as MongoQuery } from "mongoose";
import { Arg, Args, Authorized, Int, Mutation, Query, Resolver } from "type-graphql";
import { CoreResolver } from "./CoreResolver";

/**
 * Resolves common content type queries
 */
@Resolver(CommonContentType)
export class CommonContentTypeResolver extends CoreResolver {
  protected model = CommonContentTypeModel;

  /**
   * Fetches a document matching the given id or aliases
   * @param _id The id or alias of the document to return
   */
  @Query(() => CommonContentType, { nullable: true })
  public commonContentType(@Arg("_id") _id: string) {
    return super.findByAlias(_id);
  }

  /**
   * Fetches the documents matching the filter and options
   */
  @Query(() => [CommonContentType])
  public commonContentTypes(
    @Arg("filters", {nullable: true}) filters?: CommonContentTypeFilter,
    @Args() options?: Options
  ): MongoQuery<CommonContentType[]> {
    return super.findMany(filters, options);
  }

  /**
   * Returns a count of all of the documents matching the given filters
   * @param filters The filter object to count documents by. Identical to other filters
   */
  @Query(() => Int)
  public xxxCount(@Arg("filters", {nullable: true}) filters?: CommonContentTypeFilter): MongoQuery<number> {
    return super.findCount(filters);
  }

  /**
   * Inserts a new document into the database
   * @param data the data to insert into a new document
   */
  @Authorized()
  @Mutation()
  public createCommonContentType(@Arg("data") data: CreateCommonContentTypeInput): MongoQuery<CommonContentType> {
    return super.createOne(data);
  }

  /**
   * Updates a document with new data. Data not present will not be changed.
   * @param _id The id of the document to update
   * @param data The new data to upsert into the document
   */
  @Authorized()
  @Mutation(() => UpdateResponse)
  public updateCommonContentType(
    @Arg("_id") _id: string,
    @Arg("data") data: UpdateCommonContentTypeInput
  ): MongoQuery<UpdateResponse> {
    return super.updateOne(_id, data);
  }

  /**
   * Deletes a document
   * @param _id The id of the document to delete
   */
  @Authorized()
  @Mutation(() => DeleteResponse)
  public deleteCommonContentType(@Arg("_id") _id: string): MongoQuery<DeleteResponse> {
    return super.deleteOne(_id);
  }
}