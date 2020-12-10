import { Content, ContentModel } from "@reroll/model/dist/documents";
import { DeleteResponse, UpdateResponse } from "@reroll/model/dist/models/graphQLResponses";
import { ContentFilters } from "@reroll/model/dist/filters";
import { CreateContentInput, UpdateContentInput } from "@reroll/model/dist/inputs";
import { Options } from "@reroll/model/dist/inputs/Options";
import { Arg, Args, Authorized, Int, Mutation, Query, Resolver } from "type-graphql";
import { CoreResolver } from "./CoreResolver";
import {
  CreateOneResponse,
  DeleteOneResponse,
  FindCountResponse,
  FindManyResponse,
  FindOneResponse,
  UpdateOneResponse,
} from "../../types/resolvers";

/**
 * Resolves content queries
 */
@Resolver(Content)
export class ContentResolver extends CoreResolver {
  protected model = ContentModel;

  /**
   * Fetches a document matching the given id or aliases
   * @param _id The id or alias of the document to return
   */
  @Query(() => Content, { nullable: true })
  public content(@Arg("_id") _id: string): FindOneResponse<Content> {
    return super.findByAlias(_id) as FindOneResponse<Content>;
  }

  /**
   * Fetches the documents matching the filter and options
   */
  @Query(() => [Content])
  public contents(
    @Arg("filters", {nullable: true}) filters?: ContentFilters,
    @Args() options?: Options
  ): FindManyResponse<Content> {
    return super.findMany(filters, options) as FindManyResponse<Content>;
  }

  /**
   * Returns a count of all of the documents matching the given filters
   * @param filters The filter object to count documents by. Identical to other filters
   */
  @Query(() => Int)
  public contentCount(@Arg("filters", {nullable: true}) filters?: ContentFilters): FindCountResponse {
    return super.findCount(filters);
  }

  /**
   * Inserts a new document into the database
   * @param data the data to insert into a new document
   */
  @Authorized()
  @Mutation(() => Content)
  public createContent(@Arg("data") data: CreateContentInput): Promise<CreateOneResponse<Content>> {
    return super.createOne(data) as Promise<CreateOneResponse<Content>>;
  }

  /**
   * Updates a document with new data. Data not present will not be changed.
   * @param _id The id of the document to update
   * @param data The new data to upsert into the document
   */
  @Authorized()
  @Mutation(() => UpdateResponse)
  public updateContent(
    @Arg("_id") _id: string,
    @Arg("data") data: UpdateContentInput
  ): Promise<UpdateOneResponse> {
    return super.updateOne(_id, data);
  }

  /**
   * Deletes a document
   * @param _id The id of the document to delete
   */
  @Authorized()
  @Mutation(() => DeleteResponse)
  public deleteContent(@Arg("_id") _id: string): Promise<DeleteOneResponse> {
    return super.deleteOne(_id);
  }
}
