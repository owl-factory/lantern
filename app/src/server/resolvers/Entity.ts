import { Entity, EntityModel } from "@reroll/model/dist/documents";
import { DeleteResponse, UpdateResponse } from "@reroll/model/dist/models/graphQLResponses";
import { EntityFilters } from "@reroll/model/dist/filters";
import { CreateEntityInput, UpdateEntityInput } from "@reroll/model/dist/inputs";
import { Options } from "@reroll/model/dist/inputs/Options";
import { Query as MongoQuery } from "mongoose";
import { Arg, Args, Authorized, Int, Mutation, Query, Resolver } from "type-graphql";
import { CoreResolver } from "./CoreResolver";

/**
 * Resolves entity queries
 */
@Resolver(Entity)
export class EntityResolver extends CoreResolver {
  protected model = EntityModel;

  /**
   * Fetches a document matching the given id or aliases
   * @param _id The id or alias of the document to return
   */
  @Query(() => Entity, { nullable: true })
  public entity(@Arg("_id") _id: string) {
    return super.findByAlias(_id);
  }

  /**
   * Fetches the documents matching the filter and options
   */
  @Query(() => [Entity])
  public entities(
    @Arg("filters", {nullable: true}) filters?: EntityFilters,
    @Args() options?: Options
  ): MongoQuery<Entity[]> {
    return super.findMany(filters, options);
  }

  /**
   * Returns a count of all of the documents matching the given filters
   * @param filters The filter object to count documents by. Identical to other filters
   */
  @Query(() => Int)
  public entityCount(@Arg("filters", {nullable: true}) filters?: EntityFilters): MongoQuery<number> {
    return super.findCount(filters);
  }

  /**
   * Inserts a new document into the database
   * @param data the data to insert into a new document
   */
  @Authorized()
  @Mutation(() => Entity)
  public createEntity(@Arg("data") data: CreateEntityInput): MongoQuery<Entity> {
    return super.createOne(data);
  }

  /**
   * Updates a document with new data. Data not present will not be changed.
   * @param _id The id of the document to update
   * @param data The new data to upsert into the document
   */
  @Authorized()
  @Mutation(() => UpdateResponse)
  public updateEntity(
    @Arg("_id") _id: string,
    @Arg("data") data: UpdateEntityInput
  ): MongoQuery<UpdateResponse> {
    return super.updateOne(_id, data);
  }

  /**
   * Deletes a document
   * @param _id The id of the document to delete
   */
  @Authorized()
  @Mutation(() => DeleteResponse)
  public deleteEntity(@Arg("_id") _id: string): MongoQuery<DeleteResponse> {
    return super.deleteOne(_id);
  }
}