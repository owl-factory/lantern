import { EntityLayout, EntityLayoutModel } from "@reroll/model/dist/documents";
import { DeleteResponse, UpdateResponse } from "@reroll/model/dist/models/graphQLResponses";
import { EntityLayoutFilters } from "@reroll/model/dist/filters";
import { CreateEntityLayoutInput, UpdateEntityLayoutInput } from "@reroll/model/dist/inputs";
import { Options } from "@reroll/model/dist/inputs/Options";
import { Query as MongoQuery } from "mongoose";
import { Arg, Args, Authorized, Int, Mutation, Query, Resolver } from "type-graphql";
import { CoreResolver } from "./CoreResolver";

/**
 * Resolves entity layout queries
 */
@Resolver(EntityLayout)
export class EntityLayoutResolver extends CoreResolver {
  protected model = EntityLayoutModel;

  /**
   * Fetches a document matching the given id or aliases
   * @param _id The id or alias of the document to return
   */
  @Query(() => EntityLayout, { nullable: true })
  public entityLayout(@Arg("_id") _id: string) {
    return super.findByAlias(_id);
  }

  /**
   * Fetches the documents matching the filter and options
   */
  @Query(() => [EntityLayout])
  public entityLayouts(
    @Arg("filters", {nullable: true}) filters?: EntityLayoutFilters,
    @Args() options?: Options
  ): MongoQuery<EntityLayout[]> {
    return super.findMany(filters, options);
  }

  /**
   * Returns a count of all of the documents matching the given filters
   * @param filters The filter object to count documents by. Identical to other filters
   */
  @Query(() => Int)
  public entityLayoutCount(@Arg("filters", {nullable: true}) filters?: EntityLayoutFilters): MongoQuery<number> {
    return super.findCount(filters);
  }

  /**
   * Inserts a new document into the database
   * @param data the data to insert into a new document
   */
  @Authorized()
  @Mutation(() => EntityLayout)
  public createEntityLayout(@Arg("data") data: CreateEntityLayoutInput): MongoQuery<EntityLayout> {
    return super.createOne(data);
  }

  /**
   * Updates a document with new data. Data not present will not be changed.
   * @param _id The id of the document to update
   * @param data The new data to upsert into the document
   */
  @Authorized()
  @Mutation(() => UpdateResponse)
  public updateEntityLayout(
    @Arg("_id") _id: string,
    @Arg("data") data: UpdateEntityLayoutInput
  ): MongoQuery<UpdateResponse> {
    return super.updateOne(_id, data);
  }

  /**
   * Deletes a document
   * @param _id The id of the document to delete
   */
  @Authorized()
  @Mutation(() => DeleteResponse)
  public deleteEntityLayout(@Arg("_id") _id: string): MongoQuery<DeleteResponse> {
    return super.deleteOne(_id);
  }
}