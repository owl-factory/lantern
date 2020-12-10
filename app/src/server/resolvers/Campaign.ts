import { Campaign, CampaignModel } from "@reroll/model/dist/documents";
import { DeleteResponse, UpdateResponse } from "@reroll/model/dist/models/graphQLResponses";
import { CampaignFilters } from "@reroll/model/dist/filters";
import { CreateCampaignInput, UpdateCampaignInput } from "@reroll/model/dist/inputs";
import { Options } from "@reroll/model/dist/inputs/Options";
import { Arg, Args, Authorized, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { CoreResolver } from "./CoreResolver";
import { Context } from "../../types/server";
import {
  CreateOneResponse,
  DeleteOneResponse,
  FindCountResponse,
  FindManyResponse,
  FindOneResponse,
  UpdateOneResponse,
} from "../../types/resolvers";

/**
 * Resolves campaign queries
 */
@Resolver(Campaign)
export class CampaignResolver extends CoreResolver {
  protected model = CampaignModel;

  /**
   * Fetches a document matching the given id or aliases
   * @param ctx The context of the request and response, including the user's session
   * @param _id The id or alias of the document to return
   */
  @Query(() => Campaign, { nullable: true })
  public campaign(@Ctx() ctx: Context, @Arg("_id") _id: string): FindOneResponse<Campaign> {
    return super.findByAlias(ctx, _id) as FindOneResponse<Campaign>;
  }

  /**
   * Fetches the documents matching the filter and options
   * @param ctx The context of the request and response, including the user's session
   */
  @Query(() => [Campaign])
  public campaigns(
    @Ctx() ctx: Context,
    @Arg("filters", {nullable: true}) filters?: CampaignFilters,
    @Args() options?: Options
  ): FindManyResponse<Campaign> {
    return super.findMany(ctx, filters, options) as FindManyResponse<Campaign>;
  }

  /**
   * Returns a count of all of the documents matching the given filters
   * @param ctx The context of the request and response, including the user's session
   * @param filters The filter object to count documents by. Identical to other filters
   */
  @Query(() => Int)
  public campaignCount(@Ctx() ctx: Context, @Arg("filters", {nullable: true}) filters?: CampaignFilters): FindCountResponse {
    return super.findCount(ctx, filters);
  }

  /**
   * Inserts a new document into the database
   * @param ctx The context of the request and response, including the user's session
   * @param data the data to insert into a new document
   */
  @Authorized()
  @Mutation(() => Campaign)
  public createCampaign(@Ctx() ctx: Context, @Arg("data") data: CreateCampaignInput): Promise<CreateOneResponse<Campaign>> {
    return super.createOne(ctx, data) as Promise<CreateOneResponse<Campaign>>;
  }

  /**
   * Updates a document with new data. Data not present will not be changed.
   * @param ctx The context of the request and response, including the user's session
   * @param _id The id of the document to update
   * @param data The new data to upsert into the document
   */
  @Authorized()
  @Mutation(() => UpdateResponse)
  public updateCampaign(
    @Ctx() ctx: Context,
    @Arg("_id") _id: string,
    @Arg("data") data: UpdateCampaignInput
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
  public deleteCampaign(@Ctx() ctx: Context, @Arg("_id") _id: string): Promise<DeleteOneResponse> {
    return super.deleteOne(ctx, _id);
  }
}
