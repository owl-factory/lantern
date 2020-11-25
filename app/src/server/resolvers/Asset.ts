import { Asset, AssetModel } from "@reroll/model/dist/documents";
import { DeleteResponse, UpdateResponse } from "@reroll/model/dist/models/graphQLResponses";
import { AssetFilters } from "@reroll/model/dist/filters";
import { CreateAssetInput, UpdateAssetInput } from "@reroll/model/dist/inputs";
import { Options } from "@reroll/model/dist/inputs/Options";
import { Arg, Args, Authorized, Int, Mutation, Query, Resolver } from "type-graphql";
import { CoreResolver } from "./CoreResolver";
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
   * @param _id The id or alias of the document to return
   */
  @Query(() => Asset, { nullable: true })
  public asset(@Arg("_id") _id: string): FindOneResponse<Asset> {
    return super.findByAlias(_id) as FindOneResponse<Asset>;
  }

  /**
   * Fetches the documents matching the filter and options
   */
  @Query(() => [Asset])
  public assets(
    @Arg("filters", {nullable: true}) filters?: AssetFilters,
    @Args() options?: Options
  ): FindManyResponse<Asset>{
    return super.findMany(filters, options) as FindManyResponse<Asset>;
  }

  /**
   * Returns a count of all of the documents matching the given filters
   * @param filters The filter object to count documents by. Identical to other filters
   */
  @Query(() => Int)
  public assetCount(@Arg("filters", {nullable: true}) filters?: AssetFilters): FindCountResponse {
    return super.findCount(filters);
  }

  /**
   * Inserts a new document into the database
   * @param data the data to insert into a new document
   */
  @Authorized()
  @Mutation(() => Asset)
  public createAsset(@Arg("data") data: CreateAssetInput): Promise<CreateOneResponse<Asset>> {
    return super.createOne(data) as Promise<CreateOneResponse<Asset>>;
  }

  /**
   * Updates a document with new data. Data not present will not be changed.
   * @param _id The id of the document to update
   * @param data The new data to upsert into the document
   */
  @Authorized()
  @Mutation(() => UpdateResponse)
  public updateAsset(
    @Arg("_id") _id: string,
    @Arg("data") data: UpdateAssetInput
  ): Promise<UpdateOneResponse> {
    return super.updateOne(_id, data);
  }

  /**
   * Deletes a document
   * @param _id The id of the document to delete
   */
  @Authorized()
  @Mutation(() => DeleteResponse)
  public deleteAsset(@Arg("_id") _id: string): Promise<DeleteOneResponse> {
    return super.deleteOne(_id);
  }
}
