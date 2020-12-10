import { CommonEntityType, CommonEntityTypeModel } from "@reroll/model/dist/documents";
import { DeleteResponse, UpdateResponse } from "@reroll/model/dist/models/graphQLResponses";
import { CommonEntityTypeFilters } from "@reroll/model/dist/filters";
import { CreateCommonEntityTypeInput, UpdateCommonEntityTypeInput } from "@reroll/model/dist/inputs";
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
 * Resolves common entity type queries
 */
@Resolver()
export class CommonEntityTypeResolver extends CoreResolver {
  protected model = CommonEntityTypeModel;

  /**
   * Fetches a document matching the given id or aliases
   * @param ctx The context of the request and response, including the user's session
   * @param _id The id or alias of the document to return
   */
  @Query(() => CommonEntityType, { nullable: true })
  public commonEntityType(@Ctx() ctx: Context, @Arg("_id") _id: string): FindOneResponse<CommonEntityType> {
    return super.findByAlias(ctx, _id) as FindOneResponse<CommonEntityType>;
  }

  /**
   * Fetches the documents matching the filter and options
   * @param ctx The context of the request and response, including the user's session
   */
  @Query(() => [CommonEntityType])
  public commonEntityTypes(
    @Ctx() ctx: Context,
    @Arg("filters", {nullable: true}) filters?: CommonEntityTypeFilters,
    @Args() options?: Options
  ): FindManyResponse<CommonEntityType> {
    return super.findMany(ctx, filters, options) as FindManyResponse<CommonEntityType>;
  }

  /**
   * Returns a count of all of the documents matching the given filters
   * @param ctx The context of the request and response, including the user's session
   * @param filters The filter object to count documents by. Identical to other filters
   */
  @Query(() => Int)
  public commonEntityTypeCount(@Ctx() ctx: Context, @Arg("filters", {nullable: true}) filters?: CommonEntityTypeFilters): FindCountResponse {
    return super.findCount(ctx, filters);
  }

  /**
   * Inserts a new document into the database
   * @param ctx The context of the request and response, including the user's session
   * @param data the data to insert into a new document
   */
  @Authorized()
  @Mutation(() => CommonEntityType)
  public createCommonEntityType(@Ctx() ctx: Context, @Arg("data") data: CreateCommonEntityTypeInput): Promise<CreateOneResponse<CommonEntityType>> {
    return super.createOne(ctx, data) as Promise<CreateOneResponse<CommonEntityType>>;
  }

  /**
   * Updates a document with new data. Data not present will not be changed.
   * @param ctx The context of the request and response, including the user's session
   * @param _id The id of the document to update
   * @param data The new data to upsert into the document
   */
  @Authorized()
  @Mutation(() => UpdateResponse)
  public updateCommonEntityType(
    @Ctx() ctx: Context,
    @Arg("_id") _id: string,
    @Arg("data") data: UpdateCommonEntityTypeInput
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
  public deleteCommonEntityType(@Ctx() ctx: Context, @Arg("_id") _id: string): Promise<DeleteOneResponse> {
    return super.deleteOne(ctx, _id);
  }
}
