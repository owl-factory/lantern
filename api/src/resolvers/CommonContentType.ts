import { Resolver, Query, Mutation, Arg, Args } from "type-graphql";
import { CoreResolver } from "./CoreResolver";
import { CommonContentType, CommonContentTypeModel } from "@reroll/model/dist/documents/CommonContentType";
import { CommonContentTypeFilter } from "@reroll/model/dist/filters/CommonContentTypeFilter";
import { CommonContentTypeInput } from "@reroll/model/dist/inputs/CommonContentTypeInput";
import { Options } from "@reroll/model/dist/inputs/Options";
import { DeleteResponse, UpdateResponse } from "@reroll/model/dist/documents/Responses";

/**
 * Resolves CommonContentType queries
 */
@Resolver()
export class CommonContentTypeResolver extends CoreResolver {
  protected model = CommonContentTypeModel;

  /**
   * Fetches an commonContentType document matching the given id
   * @param _id The id of the commonContentType document to return
   */
  @Query(() => CommonContentType, {nullable: true})
  async commonContentType(@Arg("_id") _id: string): Promise<CommonContentType | null> {
    return super.resolver(_id);
  }

  /**
   * Fetches the commonContentType documents matching the filter and options
   */
  @Query(() => [CommonContentType])
  async commonContentTypes(
    @Arg("filters", {nullable: true}) filters?: CommonContentTypeFilter,
    @Args() options?: Options
  ): Promise<CommonContentType[]> {
    return await super.resolvers(filters, options);
  }

  /**
   * Returns a count of all of the documents matching the given filters
   * @param filters The filter object to count documents by. Identical to other filters
   */
  @Query(() => Number)
  commonContentTypeCount(@Arg("filters", {nullable: true}) filters?: CommonContentTypeFilter) {
    return super.resolverCount(filters);
  }

  /**
   * Creates a new commonContentType document
   * @param data The data object to make into a new commonContentType
   */
  @Mutation(() => CommonContentType)
  newCommonContentType(@Arg("data") data: CommonContentTypeInput, options?: any): Promise<CommonContentType> {
    return super.newResolver(data, options);
  }

  /**
   * Updates a single commonContentType document
   * @param _id The id of the document to update
   * @param data The data to replace in the document
   */
  @Mutation(() => UpdateResponse)
  updateCommonContentType(
    @Arg("_id") _id: string,
    @Arg("data") data: CommonContentTypeInput
  ): Promise<UpdateResponse> {
    return super.updateResolver(_id, data)
  }

  /**
   * Updates a single commonContentType document
   * @param data The data to replace in the document
   * @param filters The filters to select the data to replace in the document
   */
  @Mutation(() => UpdateResponse)
  updateCommonContentTypes(
    @Arg("data") data: CommonContentTypeInput,
    @Arg("filters", {nullable: true}) filters?: CommonContentTypeFilter
  ): Promise<UpdateResponse> {
    return super.updateResolvers(data, filters);
  }

  /**
   * Deletes a single commonContentType document
   * @param _id The id of the commonContentType document to delete
   */
  @Mutation(() => DeleteResponse)
  deleteCommonContentType(@Arg("_id") _id: string): Promise<DeleteResponse> {
    return super.deleteResolver(_id);
  }

  /**
   * Deletes a single commonContentType document
   * @param filters The id of the commonContentType document to delete
   */
  @Mutation(() => DeleteResponse)
  async deleteCommonContentTypes(@Arg("filters", {nullable: true}) filters?: CommonContentTypeFilter): Promise<DeleteResponse> {
    return super.deleteResolvers(filters);
  }
}