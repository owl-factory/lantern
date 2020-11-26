import { User, UserModel } from "@reroll/model/dist/documents";
import { DeleteResponse, UpdateResponse } from "@reroll/model/dist/models/graphQLResponses";
import { UserFilters } from "@reroll/model/dist/filters";
import { CreateUserInput, UpdateUserInput } from "@reroll/model/dist/inputs";
import { Options } from "@reroll/model/dist/inputs/Options";
import { Arg, Args, Authorized, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { CoreResolver } from "./CoreResolver";
import { FindOneResponse, FindManyResponse, FindCountResponse, CreateOneResponse, UpdateOneResponse, DeleteOneResponse } from "../../types/resolvers";
import { Context } from "../../types/server";

/**
 * Resolves user queries
 */
@Resolver(User)
export class UserResolver extends CoreResolver {
  protected model = UserModel;

  /**
   * Fetches a document matching the given id or aliases
   * @param ctx The context of the request and response, including the user's session
   * @param _id The id or alias of the document to return
   */
  @Query(() => User, { nullable: true })
  public user(@Ctx() ctx: Context, @Arg("_id") _id: string): FindOneResponse<User> {
    return super.findByAlias(ctx, _id) as FindOneResponse<User>;
  }

  /**
   * Fetches the documents matching the filter and options
   * @param ctx The context of the request and response, including the user's session
   */
  @Query(() => [User])
  public users(
    @Ctx() ctx: Context,
    @Arg("filters", {nullable: true}) filters?: UserFilters,
    @Args() options?: Options
  ): FindManyResponse<User> {
    return super.findMany(ctx, filters, options) as FindManyResponse<User>;
  }

  /**
   * Returns a count of all of the documents matching the given filters
   * @param ctx The context of the request and response, including the user's session
   * @param filters The filter object to count documents by. Identical to other filters
   */
  @Query(() => Int)
  public userCount(@Ctx() ctx: Context, @Arg("filters", {nullable: true}) filters?: UserFilters): FindCountResponse {
    return super.findCount(ctx, filters);
  }

  /**
   * Inserts a new document into the database
   * @param ctx The context of the request and response, including the user's session
   * @param data the data to insert into a new document
   */
  @Authorized()
  @Mutation(() => User)
  public createUser(@Ctx() ctx: Context, @Arg("data") data: CreateUserInput): Promise<CreateOneResponse<User>> {
    return super.createOne(ctx, data) as Promise<CreateOneResponse<User>>;
  }

  /**
   * Updates a document with new data. Data not present will not be changed.
   * @param ctx The context of the request and response, including the user's session
   * @param _id The id of the document to update
   * @param data The new data to upsert into the document
   */
  @Authorized()
  @Mutation(() => UpdateResponse)
  public updateUser(
    @Ctx() ctx: Context,
    @Arg("_id") _id: string,
    @Arg("data") data: UpdateUserInput
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
  public deleteUser(@Ctx() ctx: Context, @Arg("_id") _id: string): Promise<DeleteOneResponse> {
    return super.deleteOne(ctx, _id);
  }
}