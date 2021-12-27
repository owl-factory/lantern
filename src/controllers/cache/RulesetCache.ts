import { CacheController } from "@owl-factory/cache/AbstractCacheController";
import { RulesetDocument } from "types/documents";

class $RulesetCache extends CacheController<RulesetDocument> {
  key = "ruleset";
  apiURL = '/api/rulesets'
}

export const RulesetCache = new $RulesetCache();
