import { Module, ModuleModel } from "@reroll/model/dist/documents";
import { DeleteResponse, UpdateResponse } from "@reroll/model/dist/models/graphQLResponses";
import { ModuleFilters } from "@reroll/model/dist/filters";
import { CreateModuleInput, UpdateModuleInput } from "@reroll/model/dist/inputs";
import { Options } from "@reroll/model/dist/inputs/Options";
import { Arg, Args, Authorized, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { CoreResolver } from "./CoreResolver";
import { FindOneResponse, FindManyResponse, FindCountResponse, CreateOneResponse, DeleteOneResponse, UpdateOneResponse } from "../../types/resolvers";
import { Context } from "../../types/server";

/**
 * Resolves module queries
 */
@Resolver(Module)
export class ModuleResolver extends CoreResolver {
  protected model = ModuleModel;

  /**
   * Fetches a document matching the given id or aliases
   * @param ctx The context of the request and response, including the user's session
   * @param _id The id or alias of the document to return
   */
  @Query(() => Module, { nullable: true })
  public module(@Ctx() ctx: Context, @Arg("_id") _id: string): FindOneResponse<Module> {
    return super.findByAlias(ctx, _id) as FindOneResponse<Module>;
  }

  /**
   * Fetches the documents matching the filter and options
   * @param ctx The context of the request and response, including the user's session
   */
  @Query(() => [Module])
  public modules(
    @Ctx() ctx: Context,
    @Arg("filters", {nullable: true}) filters?: ModuleFilters,
    @Args() options?: Options
  ): FindManyResponse<Module> {
    return super.findMany(ctx, filters, options) as FindManyResponse<Module>;
  }

  /**
   * Returns a count of all of the documents matching the given filters
   * @param ctx The context of the request and response, including the user's session
   * @param filters The filter object to count documents by. Identical to other filters
   */
  @Query(() => Int)
  public moduleCount(@Ctx() ctx: Context, @Arg("filters", {nullable: true}) filters?: ModuleFilters): FindCountResponse {
    return super.findCount(ctx, filters);
  }

  /**
   * Inserts a new document into the database
   * @param ctx The context of the request and response, including the user's session
   * @param data the data to insert into a new document
   */
  // @Authorized()
  @Mutation(() => Module)
  public createModule(@Ctx() ctx: Context, @Arg("data") data: CreateModuleInput): Promise<CreateOneResponse<Module>> {
    return super.createOne(ctx, data) as Promise<CreateOneResponse<Module>>;
  }

  /**
   * Updates a document with new data. Data not present will not be changed.
   * @param ctx The context of the request and response, including the user's session
   * @param _id The id of the document to update
   * @param data The new data to upsert into the document
   */
  @Authorized()
  @Mutation(() => UpdateResponse)
  public updateModule(
    @Ctx() ctx: Context,
    @Arg("_id") _id: string,
    @Arg("data") data: UpdateModuleInput
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
  public deleteModule(@Ctx() ctx: Context, @Arg("_id") _id: string): Promise<DeleteOneResponse> {
    return super.deleteOne(ctx, _id);
  }
}