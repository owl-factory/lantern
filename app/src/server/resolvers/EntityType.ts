import { EntityType, EntityTypeModel } from "@reroll/model/dist/documents";
import { DeleteResponse, UpdateResponse } from "@reroll/model/dist/models/graphQLResponses";
import { EntityTypeFilters } from "@reroll/model/dist/filters";
import { CreateEntityTypeInput, UpdateEntityTypeInput } from "@reroll/model/dist/inputs";
import { Options } from "@reroll/model/dist/inputs/Options";
import { Arg, Args, Authorized, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { CoreResolver } from "./CoreResolver";
import { Context } from "../../types/server";
import {
  CreateOneResponse,
  DeleteOneResponse,
  FindCountResponse,
  FindManyResponse,
  FindOneResponse,
  UpdateOneResponse,
} from "../../types/resolvers";

/**
 * Resolves entity type queries
 */
@Resolver(EntityType)
export class EntityTypeResolver extends CoreResolver {
  protected model = EntityTypeModel;

  /**
   * Fetches a document matching the given id or aliases
   * @param ctx The context of the request and response, including the user's session
   * @param _id The id or alias of the document to return
   */
  @Query(() => EntityType, { nullable: true })
  public entityType(@Ctx() ctx: Context, @Arg("_id") _id: string): FindOneResponse<EntityType> {
    return super.findByAlias(ctx, _id) as FindOneResponse<EntityType>;
  }

  /**
   * Fetches the documents matching the filter and options
   * @param ctx The context of the request and response, including the user's session
   */
  @Query(() => [EntityType])
  public entityTypes(
    @Ctx() ctx: Context,
    @Arg("filters", {nullable: true}) filters?: EntityTypeFilters,
    @Args() options?: Options
  ): FindManyResponse<EntityType> {
    return super.findMany(ctx, filters, options) as FindManyResponse<EntityType>;
  }

  /**
   * Returns a count of all of the documents matching the given filters
   * @param ctx The context of the request and response, including the user's session
   * @param filters The filter object to count documents by. Identical to other filters
   */
  @Query(() => Int)
  public entityTypeCount(@Ctx() ctx: Context, @Arg("filters", {nullable: true}) filters?: EntityTypeFilters): FindCountResponse {
    return super.findCount(ctx, filters);
  }

  /**
   * Inserts a new document into the database
   * @param ctx The context of the request and response, including the user's session
   * @param data the data to insert into a new document
   */
  @Authorized()
  @Mutation(() => EntityType)
  public createEntityType(@Ctx() ctx: Context, @Arg("data") data: CreateEntityTypeInput): Promise<CreateOneResponse<EntityType>> {
    return super.createOne(ctx, data) as Promise<CreateOneResponse<EntityType>>;
  }

  /**
   * Updates a document with new data. Data not present will not be changed.
   * @param ctx The context of the request and response, including the user's session
   * @param _id The id of the document to update
   * @param data The new data to upsert into the document
   */
  @Authorized()
  @Mutation(() => UpdateResponse)
  public updateEntityType(
    @Ctx() ctx: Context,
    @Arg("_id") _id: string,
    @Arg("data") data: UpdateEntityTypeInput
  ): Promise<UpdateOneResponse> {
    return super.updateOne(ctx, _id, data);
  }

  /**
   * Deletes a document
   * @param ctx The context of the request and response, including the user's session
   * @param _id The id of the document to delete
   */
  @Authorized()
  @Mutation(() => DeleteResponse)
  public deleteEntityType(@Ctx() ctx: Context, @Arg("_id") _id: string): Promise<DeleteOneResponse> {
    return super.deleteOne(ctx, _id);
  }
}
