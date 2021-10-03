import { CoreDocument, RulesetDocument } from "types/documents";
import { rest } from "utilities/request";
import { DataManager } from "./DataManager";

export const RulesetManager = new DataManager<RulesetDocument>(
  "ruleset"
);

interface FetchManyResult {
  rulesets: RulesetDocument[];
}
