import { RulesetManager } from "client/data";
import { RulesetDocument } from "types/documents";
import { DataController } from "./DataController";

class $RulesetController extends DataController<RulesetDocument> {
  createURI = "/api/rulesets";
  deleteURI = "/api/rulesets";
  readURI = "/api/rulesets";
  updateURI = "/api/rulesets";
}

export const RulesetController = new $RulesetController(RulesetManager);
