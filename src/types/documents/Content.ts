import { Ref64 } from "@owl-factory/types";
import { BaseDocument } from "./BaseDocument";

export interface ContentDocument extends BaseDocument {
  type: { ref: Ref64 | null; },
  ruleset: { ref: Ref64 | null; },
}
