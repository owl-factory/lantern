import { Resolver, Query, Mutation, Arg, Args, Authorized } from "type-graphql";
import { CoreResolver } from "./CoreResolver";
import { Module, ModuleModel } from "@reroll/model/dist/documents/Module";
import { ModuleFilter } from "@reroll/model/dist/filters/ModuleFilter";
import { ModuleInput } from "@reroll/model/dist/inputs/ModuleInput";
import { Options } from "@reroll/model/dist/inputs/Options";
import { DeleteResponse, UpdateResponse } from "@reroll/model/dist/documents/Responses";
import { fetchGameSystemID } from "../utilities/resolverHelpers";

/**
 * Resolves Module queries
 */
@Resolver()
export class ModuleResolver extends CoreResolver {
  protected model = ModuleModel;

  /**
   * Fetches an module document matching the given id
   * @param _id The id of the module document to return
   */
  @Query(() => Module, {nullable: true})
  async module(@Arg("_id") _id: string): Promise<Module | null> {
    return super.resolver(_id);
  }

  /**
   * Fetches the module documents matching the filter and options
   */
  @Query(() => [Module])
  async modules(
    @Arg("filters", {nullable: true}) filters?: ModuleFilter,
    @Args() options?: Options
  ): Promise<Module[]> {
    if (!filters) { return super.resolvers(filters, options); };

    // Fetches the gameSystemID if it's given
    const [gameSystemID, validGameSystem] = await fetchGameSystemID(filters.gameSystemID_eq);
    if (!validGameSystem) { return []; };
    if (gameSystemID) { filters.gameSystemID_eq = gameSystemID; };

    return super.resolvers(filters, options);
  }

  /**
   * Returns a count of all of the documents matching the given filters
   * @param filters The filter object to count documents by. Identical to other filters
   */
  @Query(() => Number)
  async moduleCount(@Arg("filters", {nullable: true}) filters?: ModuleFilter) {
    if (!filters) { return super.resolverCount(filters); };

    // Fetches the gameSystemID if it's given
    const [gameSystemID, validGameSystem] = await fetchGameSystemID(filters.gameSystemID_eq);
    if (!validGameSystem) { return 0; };
    if (gameSystemID) { filters.gameSystemID_eq = gameSystemID; };

    return super.resolverCount(filters);
  }

  /**
   * Creates a new module document
   * @param data The data object to make into a new module
   */
  @Authorized()
  @Mutation(() => Module)
  newModule(@Arg("data") data: ModuleInput, options?: any): Promise<Module> {
    data.publishType = 1;
    return super.newResolver(data, options);
  }

  /**
   * Updates a single module document
   * @param _id The id of the document to update
   * @param data The data to replace in the document
   */
  @Authorized()
  @Mutation(() => UpdateResponse)
  updateModule(
    @Arg("_id") _id: string,
    @Arg("data") data: ModuleInput
  ): Promise<UpdateResponse> {
    return super.updateResolver(_id, data)
  }

  /**
   * Updates a single module document
   * @param data The data to replace in the document
   * @param filters The filters to select the data to replace in the document
   */
  @Authorized()
  @Mutation(() => UpdateResponse)
  updateModules(
    @Arg("data") data: ModuleInput,
    @Arg("filters", {nullable: true}) filters?: ModuleFilter
  ): Promise<UpdateResponse> {
    return super.updateResolvers(data, filters);
  }

  /**
   * Deletes a single module document
   * @param _id The id of the module document to delete
   */
  @Authorized()
  @Mutation(() => DeleteResponse)
  deleteModule(@Arg("_id") _id: string): Promise<DeleteResponse> {
    return super.deleteResolver(_id);
  }

  /**
   * Deletes a single module document
   * @param filters The id of the module document to delete
   */
  @Authorized()
  @Mutation(() => DeleteResponse)
  async deleteModules(@Arg("filters", {nullable: true}) filters?: ModuleFilter): Promise<DeleteResponse> {
    return super.deleteResolvers(filters);
  }
}