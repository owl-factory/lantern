import { Resolver, Query, Mutation, Arg, Args } from "type-graphql";
import { CoreResolver } from "./CoreResolver";
import { Content, ContentModel } from "@reroll/model/dist/documents/Content";
import { ContentFilter } from "@reroll/model/dist/filters/ContentFilter";
import { ContentInput } from "@reroll/model/dist/inputs/ContentInput";
import { Options } from "@reroll/model/dist/inputs/Options";
import { DeleteResponse, UpdateResponse } from "@reroll/model/dist/documents/Responses";

/**
 * Resolves Content queries
 */
@Resolver()
export class ContentResolver extends CoreResolver {
  protected model = ContentModel;

  /**
   * Fetches an content document matching the given id
   * @param _id The id of the content document to return
   */
  @Query(() => Content, {nullable: true})
  async content(@Arg("_id") _id: string): Promise<Content | null> {
    return super.resolver(_id);
  }

  /**
   * Fetches the content documents matching the filter and options
   */
  @Query(() => [Content])
  async contents(
    @Arg("filters", {nullable: true}) filters?: ContentFilter,
    @Args() options?: Options
  ): Promise<Content[]> {
    return await super.resolvers(filters, options);
  }

  /**
   * Returns a count of all of the documents matching the given filters
   * @param filters The filter object to count documents by. Identical to other filters
   */
  @Query(() => Number)
  contentCount(@Arg("filters", {nullable: true}) filters?: ContentFilter) {
    return super.resolverCount(filters);
  }

  /**
   * Creates a new content document
   * @param data The data object to make into a new content
   */
  @Mutation(() => Content)
  newContent(@Arg("data") data: ContentInput, options?: any): Promise<Content> {
    return super.newResolver(data, options);
  }

  /**
   * Updates a single content document
   * @param _id The id of the document to update
   * @param data The data to replace in the document
   */
  @Mutation(() => UpdateResponse)
  updateContent(
    @Arg("_id") _id: string,
    @Arg("data") data: ContentInput
  ): Promise<UpdateResponse> {
    return super.updateResolver(_id, data)
  }

  /**
   * Updates a single content document
   * @param data The data to replace in the document
   * @param filters The filters to select the data to replace in the document
   */
  @Mutation(() => UpdateResponse)
  updateContents(
    @Arg("data") data: ContentInput,
    @Arg("filters", {nullable: true}) filters?: ContentFilter
  ): Promise<UpdateResponse> {
    return super.updateResolvers(data, filters);
  }

  /**
   * Deletes a single content document
   * @param _id The id of the content document to delete
   */
  @Mutation(() => DeleteResponse)
  deleteContent(@Arg("_id") _id: string): Promise<DeleteResponse> {
    return super.deleteResolver(_id);
  }

  /**
   * Deletes a single content document
   * @param filters The id of the content document to delete
   */
  @Mutation(() => DeleteResponse)
  async deleteContents(@Arg("filters", {nullable: true}) filters?: ContentFilter): Promise<DeleteResponse> {
    return super.deleteResolvers(filters);
  }
}