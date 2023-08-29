import { Ref64 } from "types";
import { BaseDocument } from "./BaseDocument";

export interface ContentDocument extends BaseDocument {
  contentType: { ref: Ref64 | null; name: string; },
  ruleset: { ref: Ref64 | null; name: string; },
}
