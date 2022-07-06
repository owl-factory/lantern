import { Ref64 } from "@owl-factory/types";
import { BaseDocument } from "./BaseDocument";

export interface ActorDocument extends BaseDocument {
  actorType: string;
  ruleset: {
    ref: Ref64; // The ref for the ruleset this actor uses
  }
  actorSheet: {
    ref: Ref64; // The ref for the actor sheet this actor uses to render
  }
  campaign: {
    ref: Ref64;
  }
  values: Record<string, unknown>;
}
