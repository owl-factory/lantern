import { DataManager } from "@owl-factory/data/DataManager";
import { Ref64 } from "@owl-factory/types";
import { Collection } from "fauna";
import { ActorDocument } from "types/documents/Actor";

class ActorDataManager extends DataManager<Partial<ActorDocument>> {
  public collection = Collection.Actors;

  constructor() {
    super("/api/actors");
  }

  /**
   * Creates an actor with specific ruleset, actor sheet, and campaign. Returns the created actor
   * @param rulesetRef The ruleset that this character belongs to. Required.
   * @param actorSheetRef The actor sheet that this character uses. Not required, but should be selected
   * @param campaignRef The campaign that this character is a part of. Not required
   */
  public async create(rulesetRef: Ref64, actorSheetRef: Ref64, campaignRef?: Ref64) {
    const actor: Partial<ActorDocument> = {
      ruleset: { ref: rulesetRef },
    };
    if (actorSheetRef) { actor.actorSheet = { ref: actorSheetRef }; }
    if (campaignRef) { actor.campaign = { ref: campaignRef }; }
    const createdActors = await this.$create([actor]);
    if (createdActors.length === 0) { throw "The actor could not be created"; }
    return createdActors[0].doc;
  }

  /**
   * Updates an actor
   * @param actor The actor to update
   * @returns The updated actor
   */
   public async update(actor: Partial<ActorDocument>) {
    // TODO - validation
    if (actor.values?.name) { actor.name = actor.values.name as string; }
    // TODO - duplicate over other fields
    const res = await this.$update(actor);
    return res[0];
  }

}

export const ActorData = new ActorDataManager();
