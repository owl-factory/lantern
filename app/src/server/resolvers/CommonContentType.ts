import { CommonContentType, CommonContentTypeModel } from "@reroll/model/dist/documents";
import { DeleteResponse, UpdateResponse } from "@reroll/model/dist/models/graphQLResponses";
import { CommonContentTypeFilters } from "@reroll/model/dist/filters";
import { CreateCommonContentTypeInput, UpdateCommonContentTypeInput } from "@reroll/model/dist/inputs";
import { Options } from "@reroll/model/dist/inputs/Options";
import { Arg, Args, Authorized, Int, Mutation, Query, Resolver } from "type-graphql";
import { CoreResolver } from "./CoreResolver";
import { FindOneResponse, FindManyResponse, FindCountResponse, CreateOneResponse, UpdateOneResponse, DeleteOneResponse } from "../../types/resolvers";

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
  public commonContentType(@Arg("_id") _id: string): FindOneResponse<CommonContentType> {
    return super.findByAlias(_id) as FindOneResponse<CommonContentType>;
  }

  /**
   * Fetches the documents matching the filter and options
   */
  @Query(() => [CommonContentType])
  public commonContentTypes(
    @Arg("filters", {nullable: true}) filters?: CommonContentTypeFilters,
    @Args() options?: Options
  ): FindManyResponse<CommonContentType> {
    return super.findMany(filters, options) as FindManyResponse<CommonContentType>;
  }

  /**
   * Returns a count of all of the documents matching the given filters
   * @param filters The filter object to count documents by. Identical to other filters
   */
  @Query(() => Int)
  public xxxCount(@Arg("filters", {nullable: true}) filters?: CommonContentTypeFilters): FindCountResponse {
    return super.findCount(filters);
  }

  /**
   * Inserts a new document into the database
   * @param data the data to insert into a new document
   */
  @Authorized()
  @Mutation(() => CommonContentType)
  public createCommonContentType(@Arg("data") data: CreateCommonContentTypeInput): Promise<CreateOneResponse<CommonContentType>> {
    return super.createOne(data) as Promise<CreateOneResponse<CommonContentType>>;
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
  ): Promise<UpdateOneResponse> {
    return super.updateOne(_id, data);
  }

  /**
   * Deletes a document
   * @param _id The id of the document to delete
   */
  @Authorized()
  @Mutation(() => DeleteResponse)
  public deleteCommonContentType(@Arg("_id") _id: string): Promise<DeleteOneResponse> {
    return super.deleteOne(_id);
  }
}