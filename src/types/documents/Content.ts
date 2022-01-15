import { Ref64 } from "types";
import { CoreDocument } from "./CoreDocument";

export interface ContentDocument extends CoreDocument {
  type: { ref: Ref64; },
  ruleset: { ref: Ref64; },
}
