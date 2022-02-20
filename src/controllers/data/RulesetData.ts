import { CacheController } from "@owl-factory/cache/AbstractCacheController";
import { RulesetDocument } from "types/documents";
import * as storage from "@owl-factory/cache/storage/localStorage";
import { Ref64 } from "@owl-factory/types";
import { rest } from "@owl-factory/https/rest";
import { DataManager } from "@owl-factory/data/AbstractDataManager";
import { isOwner, isPublic } from "server/logic/security";

// class $RulesetData extends CacheController<RulesetDocument> {
//   key = "ruleset";
//   apiURL = '/api/rulesets';

//   protected globalRefreshTime = 0;
//   // The minimum time since the last global refresh time before the next refresh can happen.
//   protected globalRefreshDelay = 1000 * 60 * 60 * 24;

//   constructor() {
//     super();
//     this.ensureGlobals();
//   }

//   /**
//    * Ensures that global rulesets (official & public) are pulled and up to date.
//    */
//   public async ensureGlobals() {
//     const globalRefreshTimeKey = `${this.key}_global-refresh-time`;
//     const now = Date.now();

//     // Check local refresh time. Exit if not long enough
//     if ((now - this.globalRefreshTime) < this.globalRefreshDelay) {
//       return;
//     }

//     // Pull the refresh time from storage
//     const storedGlobalRefreshTime = Number(storage.get(globalRefreshTimeKey));

//     // If the stored time differs from the cache's time (eg after a refresh or another page's load) but the
//     // delay is not exceeded
//     if (!Number.isNaN(storedGlobalRefreshTime) && (now - storedGlobalRefreshTime) < this.globalRefreshDelay) {
//       this.globalRefreshTime = storedGlobalRefreshTime;
//       return;
//     }

//     // Pull the global rulesets
//     const globalRulesets = await rest.get<{ rulesets: Partial<RulesetDocument>[] }>(`/api/rulesets/globals`);
//     const globalRulesetDataItems = this.$toCacheItem(globalRulesets.data.rulesets as RulesetDocument[], {
//       loaded: false,
//       loadedAt: 0,
//       updatedAt: Date.now(),
//     });
//     this.$setMany(globalRulesetDataItems);

//     // Save refresh time to storage
//     this.globalRefreshTime = Date.now();
//     storage.set(globalRefreshTimeKey, this.globalRefreshTime);
//   }

//   public async updateIsPublic(ref: Ref64, isPublic: boolean) {
//     // TODO
//   }
// }

// export const RulesetData = new $RulesetData();

class RulesetDataManager extends DataManager<Partial<RulesetDocument>> {
  public readonly collection = "rulesets";

  constructor() {
    super();

    this.addGroup("owned-rulesets", isOwner);
    this.addGroup("public-rulesets", isPublic);
  }

  protected async loadDocuments(refs: string[]): Promise<Partial<RulesetDocument>[]> {
    if (refs.length === 0) { return []; }
    const docs = await rest.post<{ rulesets: Partial<RulesetDocument>[] }>(`/api/rulesets`, { refs: refs });
    return docs.data.rulesets;
  }
}

export const RulesetData = new RulesetDataManager();
