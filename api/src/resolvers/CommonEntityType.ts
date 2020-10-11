import { Resolver, Query, Mutation, Arg, Args, Authorized } from "type-graphql";
import { CoreResolver } from "./CoreResolver";
import { CommonEntityType, CommonEntityTypeModel } from "@reroll/model/dist/documents/CommonEntityType";
import { CommonEntityTypeFilter } from "@reroll/model/dist/filters/CommonEntityTypeFilter";
import { CommonEntityTypeInput } from "@reroll/model/dist/inputs/CommonEntityTypeInput";
import { Options } from "@reroll/model/dist/inputs/Options";
import { DeleteResponse, UpdateResponse } from "@reroll/model/dist/documents/Responses";

/**
 * Resolves CommonEntityType queries
 */
@Resolver()
export class CommonEntityTypeResolver extends CoreResolver {
  protected model = CommonEntityTypeModel;

  /**
   * Fetches an commonEntityType document matching the given id
   * @param _id The id of the commonEntityType document to return
   */
  @Query(() => CommonEntityType, {nullable: true})
  async commonEntityType(@Arg("_id") _id: string): Promise<CommonEntityType | null> {
    return super.resolver(_id);
  }

  /**
   * Fetches the commonEntityType documents matching the filter and options
   */
  @Query(() => [CommonEntityType])
  async commonEntityTypes(
    @Arg("filters", {nullable: true}) filters?: CommonEntityTypeFilter,
    @Args() options?: Options
  ): Promise<CommonEntityType[]> {
    return await super.resolvers(filters, options);
  }

  /**
   * Returns a count of all of the documents matching the given filters
   * @param filters The filter object to count documents by. Identical to other filters
   */
  @Authorized()
  @Query(() => Number)
  commonEntityTypeCount(@Arg("filters", {nullable: true}) filters?: CommonEntityTypeFilter) {
    return super.resolverCount(filters);
  }

  /**
   * Creates a new commonEntityType document
   * @param data The data object to make into a new commonEntityType
   */
  @Authorized()
  @Mutation(() => CommonEntityType)
  newCommonEntityType(@Arg("data") data: CommonEntityTypeInput, options?: any): Promise<CommonEntityType> {
    return super.newResolver(data, options);
  }

  /**
   * Updates a single commonEntityType document
   * @param _id The id of the document to update
   * @param data The data to replace in the document
   */
  @Authorized()
  @Mutation(() => UpdateResponse)
  updateCommonEntityType(
    @Arg("_id") _id: string,
    @Arg("data") data: CommonEntityTypeInput
  ): Promise<UpdateResponse> {
    return super.updateResolver(_id, data)
  }

  /**
   * Updates a single commonEntityType document
   * @param data The data to replace in the document
   * @param filters The filters to select the data to replace in the document
   */
  @Authorized()
  @Mutation(() => UpdateResponse)
  updateCommonEntityTypes(
    @Arg("data") data: CommonEntityTypeInput,
    @Arg("filters", {nullable: true}) filters?: CommonEntityTypeFilter
  ): Promise<UpdateResponse> {
    return super.updateResolvers(data, filters);
  }

  /**
   * Deletes a single commonEntityType document
   * @param _id The id of the commonEntityType document to delete
   */
  @Authorized()
  @Mutation(() => DeleteResponse)
  deleteCommonEntityType(@Arg("_id") _id: string): Promise<DeleteResponse> {
    return super.deleteResolver(_id);
  }

  /**
   * Deletes a single commonEntityType document
   * @param filters The id of the commonEntityType document to delete
   */
  @Authorized()
  @Mutation(() => DeleteResponse)
  async deleteCommonEntityTypes(@Arg("filters", {nullable: true}) filters?: CommonEntityTypeFilter): Promise<DeleteResponse> {
    return super.deleteResolvers(filters);
  }
}