import { Asset, AssetModel } from "@reroll/model/dist/documents";
import { DeleteResponse, UpdateResponse } from "@reroll/model/dist/models/graphQLResponses";
import { AssetFilters } from "@reroll/model/dist/filters";
import { CreateAssetInput, UpdateAssetInput } from "@reroll/model/dist/inputs";
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
 * Resolves asset queries
 */
@Resolver(Asset)
export class AssetResolver extends CoreResolver {
  protected model = AssetModel;

  /**
   * Fetches a document matching the given id or aliases
   * @param ctx The context of the request and response, including the user's session
   * @param _id The id or alias of the document to return
   */
  @Query(() => Asset, { nullable: true })
  public asset(@Ctx() ctx: Context, @Arg("_id") _id: string): FindOneResponse<Asset> {
    return super.findByAlias(ctx, _id) as FindOneResponse<Asset>;
  }

  /**
   * Fetches the documents matching the filter and options
   * @param ctx The context of the request and response, including the user's session
   */
  @Query(() => [Asset])
  public assets(
    @Ctx() ctx: Context,
    @Arg("filters", {nullable: true}) filters?: AssetFilters,
    @Args() options?: Options
  ): FindManyResponse<Asset>{
    return super.findMany(ctx, filters, options) as FindManyResponse<Asset>;
  }

  /**
   * Returns a count of all of the documents matching the given filters
   * @param ctx The context of the request and response, including the user's session
   * @param filters The filter object to count documents by. Identical to other filters
   */
  @Query(() => Int)
  public assetCount(@Ctx() ctx: Context, @Arg("filters", {nullable: true}) filters?: AssetFilters): FindCountResponse {
    return super.findCount(ctx, filters);
  }

  /**
   * Inserts a new document into the database
   * @param ctx The context of the request and response, including the user's session
   * @param data the data to insert into a new document
   */
  @Authorized()
  @Mutation(() => Asset)
  public createAsset(@Ctx() ctx: Context, @Arg("data") data: CreateAssetInput): Promise<CreateOneResponse<Asset>> {
    return super.createOne(ctx, data) as Promise<CreateOneResponse<Asset>>;
  }

  /**
   * Updates a document with new data. Data not present will not be changed.
   * @param ctx The context of the request and response, including the user's session
   * @param _id The id of the document to update
   * @param data The new data to upsert into the document
   */
  @Authorized()
  @Mutation(() => UpdateResponse)
  public updateAsset(
    @Ctx() ctx: Context,
    @Arg("_id") _id: string,
    @Arg("data") data: UpdateAssetInput
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
  public deleteAsset(@Ctx() ctx: Context, @Arg("_id") _id: string): Promise<DeleteOneResponse> {
    return super.deleteOne(ctx, _id);
  }
}
