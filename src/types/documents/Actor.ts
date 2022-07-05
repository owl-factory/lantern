import { Ref64 } from "@owl-factory/types";
import { Scalar } from "types";
import { BaseDocument } from "./BaseDocument";

// A partial clone of the content document type for storage within the actor document
export interface ActorContent {
  parent?: Ref64; // The parent content that this is copied from
  contentTypeRef?: Ref64;
  values: Record<string, Scalar>;
}

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
  // Simple values defined by the user in custom fields. The bread and butter of the actor's content
  values: Record<string, Scalar>;
  // ...
  content: Record<string, ActorContent[]>;
}
