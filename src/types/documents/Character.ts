import { Ref64 } from "@owl-factory/types";
import { BaseDocument } from "./BaseDocument";

export interface CharacterDocument extends BaseDocument {
  ruleset: { ref: Ref64; };
  campaign: { ref: Ref64; };
  profile: { ref: Ref64; src: string; };
}
