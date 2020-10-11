import { Resolver, Query, Mutation, Arg, Args, Authorized } from "type-graphql";
import { CoreResolver } from "./CoreResolver";
import { ContentType, ContentTypeModel } from "@reroll/model/dist/documents/ContentType";
import { ContentTypeFilter } from "@reroll/model/dist/filters/ContentTypeFilter";
import { ContentTypeInput } from "@reroll/model/dist/inputs/ContentTypeInput";
import { Options } from "@reroll/model/dist/inputs/Options";
import { DeleteResponse, UpdateResponse } from "@reroll/model/dist/documents/Responses";

/**
 * Resolves ContentType queries
 */
@Resolver()
export class ContentTypeResolver extends CoreResolver {
  protected model = ContentTypeModel;

  /**
   * Fetches an contentType document matching the given id
   * @param _id The id of the contentType document to return
   */
  @Query(() => ContentType, {nullable: true})
  async contentType(
    @Arg("_id") _id: string,
    @Arg("gameSystemID", { nullable: true }) gameSystemID?: string
  ): Promise<ContentType | null> {
    return super.resolver(_id, {gameSystemID_eq: gameSystemID});

  }

  /**
   * Fetches the contentType documents matching the filter and options
   */
  @Query(() => [ContentType])
  async contentTypes(
    @Arg("filters", {nullable: true}) filters?: ContentTypeFilter,
    @Args() options?: Options
  ): Promise<ContentType[]> {
    return await super.resolvers(filters, options);
  }

  /**
   * Returns a count of all of the documents matching the given filters
   * @param filters The filter object to count documents by. Identical to other filters
   */
  @Query(() => Number)
  contentTypeCount(@Arg("filters", {nullable: true}) filters?: ContentTypeFilter) {
    return super.resolverCount(filters);
  }

  /**
   * Creates a new contentType document
   * @param data The data object to make into a new contentType
   */
  @Authorized()
  @Mutation(() => ContentType)
  newContentType(@Arg("data") data: ContentTypeInput, options?: any): Promise<ContentType> {
    return super.newResolver(data, options);
  }

  /**
   * Updates a single contentType document
   * @param _id The id of the document to update
   * @param data The data to replace in the document
   */
  @Authorized()
  @Mutation(() => UpdateResponse)
  updateContentType(
    @Arg("_id") _id: string,
    @Arg("data") data: ContentTypeInput
  ): Promise<UpdateResponse> {
    return super.updateResolver(_id, data)
  }

  /**
   * Updates a single contentType document
   * @param data The data to replace in the document
   * @param filters The filters to select the data to replace in the document
   */
  @Authorized()
  @Mutation(() => UpdateResponse)
  updateContentTypes(
    @Arg("data") data: ContentTypeInput,
    @Arg("filters", {nullable: true}) filters?: ContentTypeFilter
  ): Promise<UpdateResponse> {
    if (data.pageLayout || data.searchLayout) {
      throw new Error("The layout may not be set en masse.")
    }
    
    return super.updateResolvers(data, filters);
  }

  /**
   * Deletes a single contentType document
   * @param _id The id of the contentType document to delete
   */
  @Authorized()
  @Mutation(() => DeleteResponse)
  deleteContentType(@Arg("_id") _id: string): Promise<DeleteResponse> {
    return super.deleteResolver(_id);
  }

  /**
   * Deletes a single contentType document
   * @param filters The id of the contentType document to delete
   */
  @Authorized()
  @Mutation(() => DeleteResponse)
  async deleteContentTypes(@Arg("filters", {nullable: true}) filters?: ContentTypeFilter): Promise<DeleteResponse> {
    return super.deleteResolvers(filters);
  }
}