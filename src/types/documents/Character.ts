import { Ref64 } from "types";
import { CoreDocument } from "./CoreDocument";

export interface CharacterDocument extends CoreDocument {
  ruleset: { ref: Ref64; };
  campaign: { ref: Ref64; };
  profile: { ref: Ref64; src: string; };
}
