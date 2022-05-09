import { Ref64 } from "@owl-factory/types";
import { BaseDocument } from "./BaseDocument";

export interface CharacterDocument extends BaseDocument {
  ruleset: { ref: Ref64 | null; };
  campaign: { ref: Ref64 | null; };
  profile: { ref: Ref64 | null; src: string; };
}
