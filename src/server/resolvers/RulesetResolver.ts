import { RulesetModel } from "../../types/documents";
import CoreResolver from "./CoreResolver";

/**
 * The resolver for CRUD operations on the Ruleset model. 
 */
export class RulesetResolver extends CoreResolver {
  public static model = RulesetModel;
}