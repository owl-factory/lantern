import { Organization, OrganizationModel } from "@reroll/model/dist/documents";
import { DeleteResponse, UpdateResponse } from "@reroll/model/dist/models/graphQLResponses";
import { OrganizationFilters } from "@reroll/model/dist/filters";
import { CreateOrganizationInput, UpdateOrganizationInput } from "@reroll/model/dist/inputs";
import { Options } from "@reroll/model/dist/inputs/Options";
import { Arg, Args, Authorized, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { CoreResolver } from "./CoreResolver";
import { FindOneResponse, FindManyResponse, FindCountResponse, CreateOneResponse, UpdateOneResponse, DeleteOneResponse } from "../../types/resolvers";
import { Context } from "../../types/server";

/**
 * Resolves organization queries
 */
@Resolver(Organization)
export class OrganizationResolver extends CoreResolver {
  protected model = OrganizationModel;

  /**
   * Fetches a document matching the given id or aliases
   * @param _id The id or alias of the document to return
   */
  @Query(() => Organization, { nullable: true })
  public organization(@Ctx() ctx: Context, @Arg("_id") _id: string): FindOneResponse<Organization> {
    return super.findByAlias(ctx, _id) as FindOneResponse<Organization>;
  }

  /**
   * Fetches the documents matching the filter and options
   */
  @Query(() => [Organization])
  public organizations(
    @Ctx() ctx: Context,
    @Arg("filters", {nullable: true}) filters?: OrganizationFilters,
    @Args() options?: Options
  ): FindManyResponse<Organization> {
    return super.findMany(ctx, filters, options) as FindManyResponse<Organization>;
  }

  /**
   * Returns a count of all of the documents matching the given filters
   * @param filters The filter object to count documents by. Identical to other filters
   */
  @Query(() => Int)
  public organizationCount(@Ctx() ctx: Context, @Arg("filters", {nullable: true}) filters?: OrganizationFilters): FindCountResponse {
    return super.findCount(ctx, filters);
  }

  /**
   * Inserts a new document into the database
   * @param data the data to insert into a new document
   */
  @Authorized()
  @Mutation(() => Organization)
  public createOrganization(@Ctx() ctx: Context, @Arg("data") data: CreateOrganizationInput): Promise<CreateOneResponse<Organization>> {
    return super.createOne(ctx, data) as Promise<CreateOneResponse<Organization>>;
  }

  /**
   * Updates a document with new data. Data not present will not be changed.
   * @param _id The id of the document to update
   * @param data The new data to upsert into the document
   */
  @Authorized()
  @Mutation(() => UpdateResponse)
  public updateOrganization(
    @Ctx() ctx: Context,
    @Arg("_id") _id: string,
    @Arg("data") data: UpdateOrganizationInput
  ): Promise<UpdateOneResponse> {
    return super.updateOne(ctx, _id, data);
  }

  /**
   * Deletes a document
   * @param _id The id of the document to delete
   */
  @Authorized()
  @Mutation(() => DeleteResponse)
  public deleteOrganization(@Ctx() ctx: Context, @Arg("_id") _id: string): Promise<DeleteOneResponse> {
    return super.deleteOne(ctx, _id);
  }
}