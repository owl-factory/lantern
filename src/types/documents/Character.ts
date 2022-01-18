import { Ref64 } from "@owl-factory/types";
import { CoreDocument } from "./CoreDocument";

export interface CharacterDocument extends CoreDocument {
  ruleset: { ref: Ref64; };
  campaign: { ref: Ref64; };
  profile: { ref: Ref64; src: string; };
}
