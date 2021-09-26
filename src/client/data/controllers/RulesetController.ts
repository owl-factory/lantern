import { RulesetDocument } from "types/documents";
import { RulesetManager } from "../managers";
import { DataController } from "./DataController";

class $RulesetController extends DataController<RulesetDocument> {
}

export const RulesetController = new $RulesetController(RulesetManager, "/api/rulesets");
