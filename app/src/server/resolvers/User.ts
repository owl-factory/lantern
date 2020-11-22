import { User, UserModel } from "@reroll/model/dist/documents";
import { DeleteResponse, UpdateResponse } from "@reroll/model/dist/models/graphQLResponses";
import { UserFilters } from "@reroll/model/dist/filters";
import { CreateUserInput, UpdateUserInput } from "@reroll/model/dist/inputs";
import { Options } from "@reroll/model/dist/inputs/Options";
import { Arg, Args, Authorized, Int, Mutation, Query, Resolver } from "type-graphql";
import { CoreResolver } from "./CoreResolver";
import { FindOneResponse, FindManyResponse, FindCountResponse, CreateOneResponse, UpdateOneResponse, DeleteOneResponse } from "../../types/resolvers";

/**
 * Resolves user queries
 */
@Resolver(User)
export class UserResolver extends CoreResolver {
  protected model = UserModel;

  /**
   * Fetches a document matching the given id or aliases
   * @param _id The id or alias of the document to return
   */
  @Query(() => User, { nullable: true })
  public user(@Arg("_id") _id: string): FindOneResponse<User> {
    return super.findByAlias(_id) as FindOneResponse<User>;
  }

  /**
   * Fetches the documents matching the filter and options
   */
  @Query(() => [User])
  public users(
    @Arg("filters", {nullable: true}) filters?: UserFilters,
    @Args() options?: Options
  ): FindManyResponse<User> {
    return super.findMany(filters, options) as FindManyResponse<User>;
  }

  /**
   * Returns a count of all of the documents matching the given filters
   * @param filters The filter object to count documents by. Identical to other filters
   */
  @Query(() => Int)
  public userCount(@Arg("filters", {nullable: true}) filters?: UserFilters): FindCountResponse {
    return super.findCount(filters);
  }

  /**
   * Inserts a new document into the database
   * @param data the data to insert into a new document
   */
  @Authorized()
  @Mutation(() => User)
  public createUser(@Arg("data") data: CreateUserInput): Promise<CreateOneResponse<User>> {
    return super.createOne(data) as Promise<CreateOneResponse<User>>;
  }

  /**
   * Updates a document with new data. Data not present will not be changed.
   * @param _id The id of the document to update
   * @param data The new data to upsert into the document
   */
  @Authorized()
  @Mutation(() => UpdateResponse)
  public updateUser(
    @Arg("_id") _id: string,
    @Arg("data") data: UpdateUserInput
  ): Promise<UpdateOneResponse> {
    return super.updateOne(_id, data);
  }

  /**
   * Deletes a document
   * @param _id The id of the document to delete
   */
  @Authorized()
  @Mutation(() => DeleteResponse)
  public deleteUser(@Arg("_id") _id: string): Promise<DeleteOneResponse> {
    return super.deleteOne(_id);
  }
}