import { Resolver, Query, Mutation, Arg, Args, Authorized } from "type-graphql";
import { CoreResolver, isID } from "./CoreResolver";
import { ContentType, ContentTypeModel } from "@reroll/model/dist/documents/ContentType";
import { ContentTypeFilter } from "@reroll/model/dist/filters/ContentTypeFilter";
import { ContentTypeInput } from "@reroll/model/dist/inputs/ContentTypeInput";
import { Options } from "@reroll/model/dist/inputs/Options";
import { DeleteResponse, UpdateResponse } from "@reroll/model/dist/documents/Responses";
import { GameSystemModel } from "@reroll/model/dist/documents/GameSystem";

/**
 * Resolves ContentType queries
 */
@Resolver()
export class ContentTypeResolver extends CoreResolver {
  protected model = ContentTypeModel;

  /**
   * Finds the ID of the game system, if given an id or alias, 
   * and returns the ID and validity
   * 
   * TODO - break this out into a subfunction wherein we pass a model
   * Do we need that though? Isn't gamesystem the unifying element?
   * Possible for users. We can move this to the CoreResolver or a helper function
   * 
   * @param gameSystemID The id/alias of the gamesystem to find the ID of
   */
  async fetchGameSystemID(gameSystemID: string | undefined): Promise<[string, boolean]> {
    if (gameSystemID && !isID(gameSystemID)) {
      const gameSystem = await GameSystemModel.findOne().where("alias").equals(gameSystemID);
      if (!gameSystem) {
        return [undefined, false];
      }

      return [gameSystem._id, true];
    }

    return [gameSystemID, true];
  }

  /**
   * Fetches an contentType document matching the given id
   * @param _id The id of the contentType document to return
   */
  @Query(() => ContentType, {nullable: true})
  async contentType(
    @Arg("_id") _id: string,
    @Arg("gameSystemID", { nullable: true }) gameSystemAlias?: string
  ): Promise<ContentType | null> {
    const [gameSystemID, validGameSystem] = await this.fetchGameSystemID(gameSystemAlias);

    if (!validGameSystem) { return null; };

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
  async contentTypeCount(@Arg("filters", {nullable: true}) filters?: ContentTypeFilter) {
    if (!filters) { return super.resolverCount(filters); };

    // Fetches the gameSystemID if it's given
    const [gameSystemID, validGameSystem] = await this.fetchGameSystemID(filters.gameSystemID_eq);
    if (!validGameSystem) { return 0; };
    if (gameSystemID) { filters.gameSystemID_eq = gameSystemID; };

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