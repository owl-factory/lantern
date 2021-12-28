import { CacheController } from "@owl-factory/cache/AbstractCacheController";
import { Ref64 } from "types";
import { RulesetDocument } from "types/documents";

class $RulesetCache extends CacheController<RulesetDocument> {
  key = "ruleset";
  apiURL = '/api/rulesets'

  public async updateIsPublic(ref: Ref64, isPublic: boolean) {
    // TODO
  }
}

export const RulesetCache = new $RulesetCache();
