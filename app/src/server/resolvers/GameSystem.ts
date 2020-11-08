import { GameSystem, GameSystemModel } from "@reroll/model/dist/documents";
import { DeleteResponse, UpdateResponse } from "@reroll/model/dist/documents/Responses";
import { GameSystemFilter } from "@reroll/model/dist/filters";
import { CreateGameSystemInput, UpdateGameSystemInput } from "@reroll/model/dist/inputs";
import { Options } from "@reroll/model/dist/inputs/Options";
import { Query as MongoQuery } from "mongoose";
import { Arg, Args, Authorized, Int, Mutation, Query, Resolver } from "type-graphql";
import { CoreResolver } from "./CoreResolver";

/**
 * Resolves game system queries
 */
@Resolver(GameSystem)
export class GameSystemResolver extends CoreResolver {
  protected model = GameSystemModel;

  /**
   * Fetches a document matching the given id or aliases
   * @param _id The id or alias of the document to return
   */
  @Query(() => GameSystem, { nullable: true })
  public gameSystem(@Arg("_id") _id: string) {
    return super.findByAlias(_id);
  }

  /**
   * Fetches the documents matching the filter and options
   */
  @Query(() => [GameSystem])
  public gameSystems(
    @Arg("filters", {nullable: true}) filters?: GameSystemFilter,
    @Args() options?: Options
  ): MongoQuery<GameSystem[]> {
    return super.findMany(filters, options);
  }

  /**
   * Returns a count of all of the documents matching the given filters
   * @param filters The filter object to count documents by. Identical to other filters
   */
  @Query(() => Int)
  public gameSystemCount(@Arg("filters", {nullable: true}) filters?: GameSystemFilter): MongoQuery<number> {
    return super.findCount(filters);
  }

  /**
   * Inserts a new document into the database
   * @param data the data to insert into a new document
   */
  // @Authorized()
  @Mutation(() => GameSystem)
  public async createGameSystem(@Arg("data") data: CreateGameSystemInput): Promise<GameSystem> {
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
    @Arg("data") data: UpdateGameSystemInput
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

// }