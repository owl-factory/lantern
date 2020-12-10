import { ContentType, ContentTypeModel } from "@reroll/model/dist/documents";
import { DeleteResponse, UpdateResponse } from "@reroll/model/dist/models/graphQLResponses";
import { ContentTypeFilters } from "@reroll/model/dist/filters";
import { CreateContentTypeInput, UpdateContentTypeInput } from "@reroll/model/dist/inputs";
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
 * Resolves content type queries
 */
@Resolver(ContentType)
export class ContentTypeResolver extends CoreResolver {
  protected model = ContentTypeModel;

  /**
   * Fetches a document matching the given id or aliases
   * @param ctx The context of the request and response, including the user's session
   * @param _id The id or alias of the document to return
   */
  @Query(() => ContentType, { nullable: true })
  public contentType(@Ctx() ctx: Context, @Arg("_id") _id: string): FindOneResponse<ContentType> {
    return super.findByAlias(ctx, _id) as FindOneResponse<ContentType>;
  }

  /**
   * Fetches the documents matching the filter and options
   * @param ctx The context of the request and response, including the user's session
   */
  @Query(() => [ContentType])
  public contentTypes(
    @Ctx() ctx: Context,
    @Arg("filters", {nullable: true}) filters?: ContentTypeFilters,
    @Args() options?: Options
  ): FindManyResponse<ContentType> {
    return super.findMany(ctx, filters, options) as FindManyResponse<ContentType>;
  }

  /**
   * Returns a count of all of the documents matching the given filters
   * @param ctx The context of the request and response, including the user's session
   * @param filters The filter object to count documents by. Identical to other filters
   */
  @Query(() => Int)
  public contentTypeCount(@Ctx() ctx: Context, @Arg("filters", {nullable: true}) filters?: ContentTypeFilters): FindCountResponse {
    return super.findCount(ctx, filters);
  }

  /**
   * Inserts a new document into the database
   * @param ctx The context of the request and response, including the user's session
   * @param data the data to insert into a new document
   */
  @Authorized()
  @Mutation(() => ContentType)
  public createContentType(@Ctx() ctx: Context, @Arg("data") data: CreateContentTypeInput): Promise<CreateOneResponse<ContentType>> {
    return super.createOne(ctx, data) as Promise<CreateOneResponse<ContentType>>;
  }

  /**
   * Updates a document with new data. Data not present will not be changed.
   * @param ctx The context of the request and response, including the user's session
   * @param _id The id of the document to update
   * @param data The new data to upsert into the document
   */
  @Authorized()
  @Mutation(() => UpdateResponse)
  public updateContentType(
    @Ctx() ctx: Context,
    @Arg("_id") _id: string,
    @Arg("data") data: UpdateContentTypeInput
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
  public deleteContentType(@Ctx() ctx: Context, @Arg("_id") _id: string): Promise<DeleteOneResponse> {
    return super.deleteOne(ctx, _id);
  }
}
