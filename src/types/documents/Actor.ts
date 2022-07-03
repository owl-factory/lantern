import { Ref64 } from "@owl-factory/types";
import { BaseDocument } from "./BaseDocument";

export interface ActorDocument extends BaseDocument {
  actorType: string;
  ruleset: {
    ref: Ref64; // The ref for the ruleset this actor uses
  }
  values: Record<string, unknown>;
}
