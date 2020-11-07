import { Resolver, Query, Mutation, Arg, Args, Authorized, Ctx, Int } from "type-graphql";
import { CoreResolver } from "./CoreResolver";
import { GameSystem, GameSystemModel } from "@reroll/model/dist/documents/GameSystem";
import { GameSystemInput } from "@reroll/model/dist/inputs/GameSystemInput";
import { Options } from "@reroll/model/dist/inputs/Options";
import { DeleteResponse, UpdateResponse } from "@reroll/model/dist/documents/Responses";
import { startSession } from "mongoose";
import { ModuleResolver } from "./ModuleResolver";
import { validatePublishType } from "../utilities/validation";
import { GameSystemFilter } from "../../../../model/dist/filters/GameSystemFilter";
import { Query as MongoQuery } from "mongoose";

type FilterType = GameSystemFilter;
type InputType = GameSystemInput;
const GQLType = GameSystem;

/**
 * Resolves GameSystem queries
 */
@Resolver(GameSystem)
export class GameSystemResolver extends CoreResolver {
  protected model = GameSystemModel;

  /**
   * Fetches a document matching the given id or aliases
   * @param _id The id or alias of the document to return
   */
  @Query(() => GQLType, { nullable: true })
  public gameSystem(@Arg("_id") _id: string) {
    return super.findByAlias(_id);
  }

  /**
   * Fetches the documents matching the filter and options
   */
  @Query(() => [GQLType])
  public gameSystems(
    @Arg("filters", {nullable: true}) filters?: FilterType,
    @Args() options?: Options
  ): MongoQuery<GameSystem[]> {
    return super.findMany(filters, options);
  }

  /**
   * Returns a count of all of the documents matching the given filters
   * @param filters The filter object to count documents by. Identical to other filters
   */
  @Query(() => Int)
  public gameSystemCount(@Arg("filters", {nullable: true}) filters?: FilterType): MongoQuery<number> {
    return super.findCount(filters);
  }

  /**
   * Inserts a new document into the database
   * @param data the data to insert into a new document
   */
  @Authorized()
  @Mutation()
  public createGameSystem(@Arg("data") data: InputType): MongoQuery<any> {
    return super.createOne(data);
  }

  /**
   * Updates a document with new data. Data not present will not be changed.
   * @param _id The id of the document to update
   * @param data The new data to upsert into the document
   */
  @Authorized()
  @Mutation(() => UpdateResponse)
  public updateGameSystem(
    @Arg("_id") _id: string,
    @Arg("data") data: InputType
  ): MongoQuery<UpdateResponse> {
    return super.updateOne(_id, data);
  }

  /**
   * Deletes a document
   * @param _id The id of the document to delete
   */
  @Authorized()
  @Mutation(() => DeleteResponse)
  public deleteGameSystem(@Arg("_id") _id: string): MongoQuery<DeleteResponse> {
    return super.deleteOne(_id);
  }

  /**
   * Creates a new gameSystem document and default module
   * @param data The data object to make into a new gameSystem
   */
  // @Authorized()
  // @Mutation(() => GameSystem)
  // async newGameSystem(
  //   @Arg("data") data: GameSystemInput,
  //   @Ctx() ctx: any
  // ) {
  //   const session = await startSession();
  //   let gameSystemDocument = null;

  //   const publishTypeError = validatePublishType(ctx, data.publishType);
  //   if (publishTypeError) { throw Error(publishTypeError); ;}
    
  //   try {
  //     // Starts a transaction to 
  //     session.startTransaction();
  //     gameSystemDocument = await super.newResolver(data, { session: session });

  //     const moduleResolver = new ModuleResolver();
  //     const moduleDocument = await moduleResolver.newModule({
  //       name: "Standard Rules", 
  //       gameSystemID: gameSystemDocument._id,
  //       publishType: data.publishType
  //     }, { session });

  //     this.updateGameSystem(
  //       gameSystemDocument._id, 
  //       { defaultModuleID: moduleDocument._id }, 
  //       { session }
  //     );

  //     gameSystemDocument.defaultModuleID = moduleDocument._id;

  //     session.commitTransaction();
  //     return gameSystemDocument;

  //   } catch (error) {
  //     await session.abortTransaction();
  //     session.endSession();
  //     throw error;
  //   }
  // }

  /**
   * Updates a single gameSystem document
   * @param _id The id of the document to update
   * @param data The data to replace in the document
   */
  // @Authorized()
  // @Mutation(() => UpdateResponse)
  // updateGameSystem(
  //   @Arg("_id") _id: string,
  //   @Arg("data") data: GameSystemInput,
  //   options?: any
  // ): Promise<UpdateResponse> {
  //   return super.updateResolver(_id, data)
  // }

  /**
   * Updates a single gameSystem document
   * @param data The data to replace in the document
   * @param filters The filters to select the data to replace in the document
   */
  // @Authorized()
  // @Mutation(() => UpdateResponse)
  // updateGameSystems(
  //   @Arg("data") data: GameSystemInput,
  //   @Arg("filters", {nullable: true}) filters?: GameSystemFilter
  // ): Promise<UpdateResponse> {
  //   return super.updateResolvers(data, filters);
  // }

  /**
   * Deletes a single gameSystem document
   * @param _id The id of the gameSystem document to delete
   */
  // @Authorized()
  // @Mutation(() => DeleteResponse)
  // deleteGameSystem(@Arg("_id") _id: string): Promise<DeleteResponse> {
  //   return super.deleteResolver(_id);
  // }

  /**
   * Deletes a single gameSystem document
   * @param filters The id of the gameSystem document to delete
   */
  // @Authorized()
  // @Mutation(() => DeleteResponse)
  // async deleteGameSystems(@Arg("filters", {nullable: true}) filters?: GameSystemFilter): Promise<DeleteResponse> {
  //   return super.deleteResolvers(filters);
  // }
}