import { Resolver, Query, Mutation, Arg, Args, Ctx, Authorized } from "type-graphql";
import { CoreResolver } from "./CoreResolver";
// import { Character, CharacterModel } from "@reroll/model/dist/documents";
import { authorize } from "../utilities/auth";
import { GameSystem } from "@reroll/model/dist/documents";

/**
 * Resolves Character queries
 */
@Resolver()
export class CharacterResolver extends CoreResolver {
  // protected model = CharacterModel;

  

  // test resolver
  // Block entire resolver @Authorized()
  @Query(() => GameSystem)
  async user(@Ctx() ctx: any): Promise<GameSystem> {
    console.log(ctx)
    const authed = await authorize(ctx);
    const user = ctx.session.user;
    console.log(user)
    if (authed) {
      return { _id: user.email, name: user.name }
    } else {
      return { _id: "oooooooooo", name: "aaaaaaaaaa" }
    }
  }
}