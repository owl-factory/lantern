import { EntityType, EntityTypeModel } from "@reroll/model/dist/documents";
import { DeleteResponse, UpdateResponse } from "@reroll/model/dist/models/graphQLResponses";
import { EntityTypeFilters } from "@reroll/model/dist/filters";
import { CreateEntityTypeInput, UpdateEntityTypeInput } from "@reroll/model/dist/inputs";
import { Options } from "@reroll/model/dist/inputs/Options";
import { Query as MongoQuery } from "mongoose";
import { Arg, Args, Authorized, Int, Mutation, Query, Resolver } from "type-graphql";
import { CoreResolver } from "./CoreResolver";

/**
 * Resolves entity type queries
 */
@Resolver(EntityType)
export class EntityTypeResolver extends CoreResolver {
  protected model = EntityTypeModel;

  /**
   * Fetches a document matching the given id or aliases
   * @param _id The id or alias of the document to return
   */
  @Query(() => EntityType, { nullable: true })
  public entityType(@Arg("_id") _id: string) {
    return super.findByAlias(_id);
  }

  /**
   * Fetches the documents matching the filter and options
   */
  @Query(() => [EntityType])
  public entityTypes(
    @Arg("filters", {nullable: true}) filters?: EntityTypeFilters,
    @Args() options?: Options
  ): MongoQuery<EntityType[]> {
    return super.findMany(filters, options);
  }

  /**
   * Returns a count of all of the documents matching the given filters
   * @param filters The filter object to count documents by. Identical to other filters
   */
  @Query(() => Int)
  public entityTypeCount(@Arg("filters", {nullable: true}) filters?: EntityTypeFilters): MongoQuery<number> {
    return super.findCount(filters);
  }

  /**
   * Inserts a new document into the database
   * @param data the data to insert into a new document
   */
  @Authorized()
  @Mutation(() => EntityType)
  public createEntityType(@Arg("data") data: CreateEntityTypeInput): MongoQuery<EntityType> {
    return super.createOne(data);
  }

  /**
   * Updates a document with new data. Data not present will not be changed.
   * @param _id The id of the document to update
   * @param data The new data to upsert into the document
   */
  @Authorized()
  @Mutation(() => UpdateResponse)
  public updateEntityType(
    @Arg("_id") _id: string,
    @Arg("data") data: UpdateEntityTypeInput
  ): MongoQuery<UpdateResponse> {
    return super.updateOne(_id, data);
  }

  /**
   * Deletes a document
   * @param _id The id of the document to delete
   */
  @Authorized()
  @Mutation(() => DeleteResponse)
  public deleteEntityType(@Arg("_id") _id: string): MongoQuery<DeleteResponse> {
    return super.deleteOne(_id);
  }
}