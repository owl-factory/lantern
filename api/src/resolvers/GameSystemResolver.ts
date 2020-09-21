import { Resolver, Query, Mutation, Arg, Args } from "type-graphql";
import { CoreResolver, isID } from "./CoreResolver";
import { GameSystem, GameSystemFilter, GameSystemModel } from "@reroll/model/dist/documents/GameSystem";
import { GameSystemInput } from "@reroll/model/dist/inputs/GameSystemInput";
import { Options } from "@reroll/model/dist/inputs/Options";
import { DeleteResponse, UpdateResponse } from "@reroll/model/dist/documents/Responses";
import { startSession } from "mongoose";
import { ModuleResolver } from "./ModuleResolver";

/**
 * Resolves GameSystem queries
 */
@Resolver()
export class GameSystemResolver extends CoreResolver {
  protected model = GameSystemModel;

  /**
   * Fetches a document matching the given id or aliases
   * @param _id The id or alias of the document to return
   */
  @Query(() => GameSystem, { nullable: true })
  gameSystem(@Arg("_id") _id: string) {
    return this.resolver(_id);
  }

  /**
   * Fetches the gameSystem documents matching the filter and options
   */
  @Query(() => [GameSystem])
  async gameSystems(
    @Arg("filters", GameSystemFilter, {nullable: true}) filters?: any,
    @Args() options?: Options
  ): Promise<GameSystem[]> {
    return super.resolvers(filters, options);
  }

  /**
   * Returns a count of all of the documents matching the given filters
   * @param filters The filter object to count documents by. Identical to other filters
   */
  @Query(() => Number)
  gameSystemCount(@Arg("filters", GameSystemFilter, {nullable: true}) filters?: any) {
    return super.resolverCount(filters);
  }

  /**
   * Creates a new gameSystem document and default module
   * @param data The data object to make into a new gameSystem
   */
  @Mutation(() => GameSystem)
  async newGameSystem(@Arg("data") data: GameSystemInput) {
    const session = await startSession();
    let gameSystemDocument = null;
    
    try {
      // Starts a transaction to 
      session.startTransaction();
      gameSystemDocument = await super.newResolver(data, { session: session });

      const moduleResolver = new ModuleResolver();
      const moduleDocument = await moduleResolver.newModule({
        name: "Standard Rules", 
        gameSystemID: gameSystemDocument._id
      }, { session });

      this.updateGameSystem(
        gameSystemDocument._id, 
        { defaultModuleID: moduleDocument._id }, 
        { session }
      );

      gameSystemDocument.defaultModuleID = moduleDocument._id;

      session.commitTransaction();
      return gameSystemDocument;

    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  /**
   * Updates a single gameSystem document
   * @param _id The id of the document to update
   * @param data The data to replace in the document
   */
  @Mutation(() => UpdateResponse)
  updateGameSystem(
    @Arg("_id") _id: string,
    @Arg("data") data: GameSystemInput,
    options?: any
  ): Promise<UpdateResponse> {
    return super.updateResolver(_id, data)
  }

  /**
   * Updates a single gameSystem document
   * @param data The data to replace in the document
   * @param filters The filters to select the data to replace in the document
   */
  @Mutation(() => UpdateResponse)
  updateGameSystems(
    @Arg("data") data: GameSystemInput,
    @Arg("filters", GameSystemFilter, {nullable: true}) filters?: any
  ): Promise<UpdateResponse> {
    return super.updateResolvers(data, filters);
  }

  /**
   * Deletes a single gameSystem document
   * @param _id The id of the gameSystem document to delete
   */
  @Mutation(() => DeleteResponse)
  deleteGameSystem(@Arg("_id") _id: string): Promise<DeleteResponse> {
    return super.deleteResolver(_id);
  }

  /**
   * Deletes a single gameSystem document
   * @param filters The id of the gameSystem document to delete
   */
  @Mutation(() => DeleteResponse)
  async deleteGameSystems(@Arg("filters", GameSystemFilter, {nullable: true}) filters?: any): Promise<DeleteResponse> {
    return super.deleteResolvers(filters);
  }
}