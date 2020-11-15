import { Organization, OrganizationModel } from "@reroll/model/dist/documents";
import { DeleteResponse, UpdateResponse } from "@reroll/model/dist/models/graphQLResponses";
import { OrganizationFilters } from "@reroll/model/dist/filters";
import { CreateOrganizationInput, UpdateOrganizationInput } from "@reroll/model/dist/inputs";
import { Options } from "@reroll/model/dist/inputs/Options";
import { Query as MongoQuery } from "mongoose";
import { Arg, Args, Authorized, Int, Mutation, Query, Resolver } from "type-graphql";
import { CoreResolver } from "./CoreResolver";

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
  public organization(@Arg("_id") _id: string): Promise<MongoQuery<Organization> | null> {
    return super.findByAlias(_id);
  }

  /**
   * Fetches the documents matching the filter and options
   */
  @Query(() => [Organization])
  public organizations(
    @Arg("filters", {nullable: true}) filters?: OrganizationFilters,
    @Args() options?: Options
  ): MongoQuery<Organization[]> {
    return super.findMany(filters, options);
  }

  /**
   * Returns a count of all of the documents matching the given filters
   * @param filters The filter object to count documents by. Identical to other filters
   */
  @Query(() => Int)
  public organizationCount(@Arg("filters", {nullable: true}) filters?: OrganizationFilters): MongoQuery<number> {
    return super.findCount(filters);
  }

  /**
   * Inserts a new document into the database
   * @param data the data to insert into a new document
   */
  @Authorized()
  @Mutation(() => Organization)
  public createOrganization(@Arg("data") data: CreateOrganizationInput): MongoQuery<Organization> {
    return super.createOne(data);
  }

  /**
   * Updates a document with new data. Data not present will not be changed.
   * @param _id The id of the document to update
   * @param data The new data to upsert into the document
   */
  @Authorized()
  @Mutation(() => UpdateResponse)
  public updateOrganization(
    @Arg("_id") _id: string,
    @Arg("data") data: UpdateOrganizationInput
  ): MongoQuery<UpdateResponse> {
    return super.updateOne(_id, data);
  }

  /**
   * Deletes a document
   * @param _id The id of the document to delete
   */
  @Authorized()
  @Mutation(() => DeleteResponse)
  public deleteOrganization(@Arg("_id") _id: string): MongoQuery<DeleteResponse> {
    return super.deleteOne(_id);
  }
}