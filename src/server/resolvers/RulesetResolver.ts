import {
  Context,
  CreateModuleInput,
  CreateOneResponse,
  CreateRulesetInput,
  GenericDocumentType,
  RulesetDoc,
  RulesetModel
} from "../../types";
import CoreResolver from "./CoreResolver";
import { ModuleResolver } from "./ModuleResolver";

/**
 * The resolver for CRUD operations on the Ruleset model.
 */
export class RulesetResolver extends CoreResolver {
  public static model = RulesetModel;

  /**
   * Creates a single new document and inserts it into the database
   * @param ctx The context of the request and response, including the user's session
   * @param data The data to insert into a new document
   * @param options Any additional options to save the data
   */
  public static async createOne(
    input: CreateRulesetInput,
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
      } as CreateModuleInput, ctx);
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
}