import { CommonContentType, CommonContentTypeModel } from "@reroll/model/dist/documents";
import { DeleteResponse, UpdateResponse } from "@reroll/model/dist/models/graphQLResponses";
import { CommonContentTypeFilters } from "@reroll/model/dist/filters";
import { CreateCommonContentTypeInput, UpdateCommonContentTypeInput } from "@reroll/model/dist/inputs";
import { Options } from "@reroll/model/dist/inputs/Options";
import { Arg, Args, Authorized, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { CoreResolver } from "./CoreResolver";
import { FindOneResponse, FindManyResponse, FindCountResponse, CreateOneResponse, UpdateOneResponse, DeleteOneResponse } from "../../types/resolvers";
import { Context } from "../../types/server";

/**
 * Resolves common content type queries
 */
@Resolver(CommonContentType)
export class CommonContentTypeResolver extends CoreResolver {
  protected model = CommonContentTypeModel;

  /**
   * Fetches a document matching the given id or aliases
   * @param ctx The context of the request and response, including the user's session
   * @param _id The id or alias of the document to return
   */
  @Query(() => CommonContentType, { nullable: true })
  public commonContentType(@Ctx() ctx: Context, @Arg("_id") _id: string): FindOneResponse<CommonContentType> {
    return super.findByAlias(ctx, _id) as FindOneResponse<CommonContentType>;
  }

  /**
   * Fetches the documents matching the filter and options
   * @param ctx The context of the request and response, including the user's session
   */
  @Query(() => [CommonContentType])
  public commonContentTypes(
    @Ctx() ctx: Context,
    @Arg("filters", {nullable: true}) filters?: CommonContentTypeFilters,
    @Args() options?: Options
  ): FindManyResponse<CommonContentType> {
    return super.findMany(ctx, filters, options) as FindManyResponse<CommonContentType>;
  }

  /**
   * Returns a count of all of the documents matching the given filters
   * @param ctx The context of the request and response, including the user's session
   * @param filters The filter object to count documents by. Identical to other filters
   */
  @Query(() => Int)
  public commonContentTypeCount(@Ctx() ctx: Context, @Arg("filters", {nullable: true}) filters?: CommonContentTypeFilters): FindCountResponse {
    return super.findCount(ctx, filters);
  }

  /**
   * Inserts a new document into the database
   * @param ctx The context of the request and response, including the user's session
   * @param data the data to insert into a new document
   */
  @Authorized()
  @Mutation(() => CommonContentType)
  public createCommonContentType(@Ctx() ctx: Context, @Arg("data") data: CreateCommonContentTypeInput): Promise<CreateOneResponse<CommonContentType>> {
    return super.createOne(ctx, data) as Promise<CreateOneResponse<CommonContentType>>;
  }

  /**
   * Updates a document with new data. Data not present will not be changed.
   * @param ctx The context of the request and response, including the user's session
   * @param _id The id of the document to update
   * @param data The new data to upsert into the document
   */
  @Authorized()
  @Mutation(() => UpdateResponse)
  public updateCommonContentType(
    @Ctx() ctx: Context,
    @Arg("_id") _id: string,
    @Arg("data") data: UpdateCommonContentTypeInput
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
  public deleteCommonContentType(@Ctx() ctx: Context, @Arg("_id") _id: string): Promise<DeleteOneResponse> {
    return super.deleteOne(ctx, _id);
  }
}