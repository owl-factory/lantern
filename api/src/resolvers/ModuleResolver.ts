import { Resolver, Query, Mutation, Arg, Args } from "type-graphql";
import { CoreResolver } from "./CoreResolver";
import { Module, ModuleFilter, ModuleModel } from "@reroll/model/dist/documents/Module";
import { ModuleInput } from "@reroll/model/dist/inputs/ModuleInput";
import { Options } from "@reroll/model/dist/inputs/Options";
import { DeleteResponse, UpdateResponse } from "@reroll/model/dist/documents/Responses";

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
  @Query(() => Module)
  async module(@Arg("_id") _id: string): Promise<Module> {
    return super.resolver(_id);
  }

  /**
   * Fetches the module documents matching the filter and options
   */
  @Query(() => [Module])
  async modules(
    @Arg("filters", ModuleFilter, {nullable: true}) filters?: any,
    @Args() options?: Options
  ): Promise<Module[]> {
    return await super.resolvers(filters, options);
  }

  /**
   * Creates a new module document
   * @param data The data object to make into a new module
   */
  @Mutation(() => Module)
  newModule(@Arg("data") data: ModuleInput, options?: any): Promise<Module> {
    return super.newResolver(data, options);
  }

  /**
   * Updates a single module document
   * @param _id The id of the document to update
   * @param data The data to replace in the document
   */
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
  @Mutation(() => UpdateResponse)
  updateModules(
    @Arg("data") data: ModuleInput,
    @Arg("filters", ModuleFilter, {nullable: true}) filters?: any
  ): Promise<UpdateResponse> {
    return super.updateResolvers(data, filters);
  }

  /**
   * Deletes a single module document
   * @param _id The id of the module document to delete
   */
  @Mutation(() => DeleteResponse)
  deleteModule(@Arg("_id") _id: string): Promise<DeleteResponse> {
    return super.deleteResolver(_id);
  }

  /**
   * Deletes a single module document
   * @param filters The id of the module document to delete
   */
  @Mutation(() => DeleteResponse)
  async deleteModules(@Arg("filters", ModuleFilter, {nullable: true}) filters?: any): Promise<DeleteResponse> {
    return super.deleteResolvers(filters);
  }
}