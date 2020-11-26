import { Rule, RuleModel } from "@reroll/model/dist/documents";
import { DeleteResponse, UpdateResponse } from "@reroll/model/dist/models/graphQLResponses";
import { RuleFilters } from "@reroll/model/dist/filters";
import { CreateRuleInput, UpdateRuleInput } from "@reroll/model/dist/inputs";
import { Options } from "@reroll/model/dist/inputs/Options";
import { Arg, Args, Authorized, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { CoreResolver } from "./CoreResolver";
import { FindOneResponse, FindManyResponse, FindCountResponse, UpdateOneResponse, DeleteOneResponse, CreateOneResponse } from "../../types/resolvers";
import { Context } from "../../types/server";

/**
 * Resolves rule queries
 */
@Resolver(Rule)
export class RuleResolver extends CoreResolver {
  protected model = RuleModel;

  /**
   * Fetches a document matching the given id or aliases
   * @param ctx The context of the request and response, including the user's session
   * @param _id The id or alias of the document to return
   */
  @Query(() => Rule, { nullable: true })
  public rule(@Ctx() ctx: Context, @Arg("_id") _id: string): FindOneResponse<Rule> {
    return super.findByAlias(ctx, _id) as FindOneResponse<Rule>;
  }

  /**
   * Fetches the documents matching the filter and options
   * @param ctx The context of the request and response, including the user's session
   */
  @Query(() => [Rule])
  public rules(
    @Ctx() ctx: Context,
    @Arg("filters", {nullable: true}) filters?: RuleFilters,
    @Args() options?: Options
  ): FindManyResponse<Rule> {
    return super.findMany(ctx, filters, options) as FindManyResponse<Rule>;
  }

  /**
   * Returns a count of all of the documents matching the given filters
   * @param ctx The context of the request and response, including the user's session
   * @param filters The filter object to count documents by. Identical to other filters
   */
  @Query(() => Int)
  public ruleCount(@Ctx() ctx: Context, @Arg("filters", {nullable: true}) filters?: RuleFilters): FindCountResponse {
    return super.findCount(ctx, filters);
  }

  /**
   * Inserts a new document into the database
   * @param ctx The context of the request and response, including the user's session
   * @param data the data to insert into a new document
   */
  @Authorized()
  @Mutation(() => Rule)
  public createRule(@Ctx() ctx: Context, @Arg("data") data: CreateRuleInput): Promise<CreateOneResponse<Rule>> {
    return super.createOne(ctx, data) as Promise<CreateOneResponse<Rule>>;
  }

  /**
   * Updates a document with new data. Data not present will not be changed.
   * @param ctx The context of the request and response, including the user's session
   * @param _id The id of the document to update
   * @param data The new data to upsert into the document
   */
  @Authorized()
  @Mutation(() => UpdateResponse)
  public updateRule(
    @Ctx() ctx: Context,
    @Arg("_id") _id: string,
    @Arg("data") data: UpdateRuleInput
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
  public deleteRule(@Ctx() ctx: Context, @Arg("_id") _id: string): Promise<DeleteOneResponse> {
    return super.deleteOne(ctx, _id);
  }
}