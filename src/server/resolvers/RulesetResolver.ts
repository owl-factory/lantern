import {
  Context,
  CreateOneResponse,
  RulesetDoc,
} from "../../types";
import { ModuleResolver } from "./ModuleResolver";
import { RulesetModel } from "..";
import { CoreResolver } from "./CoreResolver";
import { Query, Resolver } from "type-graphql";

/**
 * The resolver for CRUD operations on the Ruleset model.
 */
@Resolver()
export class RulesetResolver extends CoreResolver {
  public static model = RulesetModel;

  @Query(() => [RulesetDoc])
  public static async test2(): any {
    return this.findMany();
  }

  /**
   * Creates a single new document and inserts it into the database
   * @param ctx The context of the request and response, including the user's session
   * @param data The data to insert into a new document
   * @param options Any additional options to save the data
   */
  public static async createOne(
    input: Record<string, unknown>,
    ctx?: Context
  ): Promise<CreateOneResponse<RulesetDoc>> {
    let rulesetID = "";
    let moduleID = "";

    try {
      // Create ruleset
      const ruleset = await super.createOne(input, ctx);
      rulesetID = ruleset._id;

      // Create default module
      const module = await ModuleResolver.createOne({
        name: "Core Rules",
        rulesetID: rulesetID,
      }, ctx);
      moduleID = module._id as string;

      // Set ruleset's default module
      await super.updateOne(rulesetID, { defaultModuleID: moduleID }, ctx);

      return ruleset;

    } catch( e ) {
      if (rulesetID.length === 24) { await super.deleteOne(rulesetID); }
      if (moduleID.length === 24) { await ModuleResolver.deleteOne(rulesetID); }
      throw e;
    }
  }

  /**
   * Deletes a single ruleset and it's associated default module
   * @param _id The id of the ruleset to delete
   * @param ctx The context 
   */
  public static async deleteOne(_id: string, ctx?: Context): Promise<any> {
    // TODO - this is gonna be a hecking big function if we need to delete everything

    // INitial delete
    const ruleset = (await super.findOne(_id)) as RulesetDoc;
    await ModuleResolver.deleteOne(ruleset.defaultModuleID as string);
    await super.deleteOne(_id);
  }
}
