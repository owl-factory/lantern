import { Resolver, Query, Mutation, Arg, Args, Ctx } from "type-graphql";
import { CoreResolver } from "./CoreResolver";
import { Character, CharacterFilter, CharacterModel } from "@reroll/model/dist/documents/Character";
import { CharacterInput } from "@reroll/model/dist/inputs/CharacterInput";
import { Options } from "@reroll/model/dist/inputs/Options";
import { DeleteResponse, UpdateResponse } from "@reroll/model/dist/documents/Responses";
import { authenticate } from "../utilities/auth";

/**
 * Resolves Character queries
 */
@Resolver()
export class CharacterResolver extends CoreResolver {
  protected model = CharacterModel;

  /**
   * Fetches an character document matching the given id
   * @param _id The id of the character document to return
   */
  @Query(() => Character)
  async character(@Arg("_id") _id: string): Promise<Character> {
    return super.resolver(_id);
  }

  // test resolver
  @Query(() => Character)
  async user(@Ctx() ctx): Promise<Character> {
    if (ctx.token) {
      const user = await authenticate(ctx.token);
      return { _id: user.email, name: user.user_metadata.full_name }
    } else {
      return { _id: "not logged in", name: "" }
    }
  }

  /**
   * Fetches the character documents matching the filter and options
   */
  @Query(() => [Character])
  async characters(
    @Arg("filters", CharacterFilter, {nullable: true}) filters?: any,
    @Args() options?: Options
  ): Promise<Character[]> {
    return await super.resolvers(filters, options);
  }

  /**
   * Creates a new character document
   * @param data The data object to make into a new character
   */
  @Mutation(() => Character)
  newCharacter(@Arg("data") data: CharacterInput): Promise<Character> {
    return super.newResolver(data);
  }

  /**
   * Updates a single character document
   * @param _id The id of the document to update
   * @param data The data to replace in the document
   */
  @Mutation(() => UpdateResponse)
  updateCharacter(
    @Arg("_id") _id: string,
    @Arg("data") data: CharacterInput
  ): Promise<UpdateResponse> {
    return super.updateResolver(_id, data)
  }

  /**
   * Updates a single character document
   * @param data The data to replace in the document
   * @param filters The filters to select the data to replace in the document
   */
  @Mutation(() => UpdateResponse)
  updateCharacters(
    @Arg("data") data: CharacterInput,
    @Arg("filters", CharacterFilter, {nullable: true}) filters?: any
  ): Promise<UpdateResponse> {
    return super.updateResolvers(data, filters);
  }

  /**
   * Deletes a single character document
   * @param _id The id of the character document to delete
   */
  @Mutation(() => DeleteResponse)
  deleteCharacter(@Arg("_id") _id: string): Promise<DeleteResponse> {
    return super.deleteResolver(_id);
  }

  /**
   * Deletes a single character document
   * @param filters The id of the character document to delete
   */
  @Mutation(() => DeleteResponse)
  async deleteCharacters(@Arg("filters", CharacterFilter, {nullable: true}) filters?: any): Promise<DeleteResponse> {
    return super.deleteResolvers(filters);
  }
}