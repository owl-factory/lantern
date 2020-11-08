import { CommonEntityType, CommonEntityTypeModel } from "@reroll/model/dist/documents";
import { DeleteResponse, UpdateResponse } from "@reroll/model/dist/documents/Responses";
import { CommonEntityTypeFilter } from "@reroll/model/dist/filters";
import { CreateCommonEntityTypeInput, UpdateCommonEntityTypeInput } from "@reroll/model/dist/inputs";
import { Options } from "@reroll/model/dist/inputs/Options";
import { Query as MongoQuery } from "mongoose";
import { Arg, Args, Authorized, Int, Mutation, Query, Resolver } from "type-graphql";
import { CoreResolver } from "./CoreResolver";

/**
 * Resolves common entity type queries
 */
@Resolver()
export class CommonEntityTypeResolver extends CoreResolver {
  protected model = CommonEntityTypeModel;

  /**
   * Fetches a document matching the given id or aliases
   * @param _id The id or alias of the document to return
   */
  @Query(() => CommonEntityType, { nullable: true })
  public commonEntityType(@Arg("_id") _id: string) {
    return super.findByAlias(_id);
  }

  /**
   * Fetches the documents matching the filter and options
   */
  @Query(() => [CommonEntityType])
  public commonEntityTypes(
    @Arg("filters", {nullable: true}) filters?: CommonEntityTypeFilter,
    @Args() options?: Options
  ): MongoQuery<CommonEntityType[]> {
    return super.findMany(filters, options);
  }

  /**
   * Returns a count of all of the documents matching the given filters
   * @param filters The filter object to count documents by. Identical to other filters
   */
  @Query(() => Int)
  public commonEntityTypeCount(@Arg("filters", {nullable: true}) filters?: CommonEntityTypeFilter): MongoQuery<number> {
    return super.findCount(filters);
  }

  /**
   * Inserts a new document into the database
   * @param data the data to insert into a new document
   */
  @Authorized()
  @Mutation()
  public createCommonEntityType(@Arg("data") data: CreateCommonEntityTypeInput): MongoQuery<CommonEntityType> {
    return super.createOne(data);
  }

  /**
   * Updates a document with new data. Data not present will not be changed.
   * @param _id The id of the document to update
   * @param data The new data to upsert into the document
   */
  @Authorized()
  @Mutation(() => UpdateResponse)
  public updateCommonEntityType(
    @Arg("_id") _id: string,
    @Arg("data") data: UpdateCommonEntityTypeInput
  ): MongoQuery<UpdateResponse> {
    return super.updateOne(_id, data);
  }

  /**
   * Deletes a document
   * @param _id The id of the document to delete
   */
  @Authorized()
  @Mutation(() => DeleteResponse)
  public deleteCommonEntityType(@Arg("_id") _id: string): MongoQuery<DeleteResponse> {
    return super.deleteOne(_id);
  }
}