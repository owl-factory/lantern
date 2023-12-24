import { Ref64 } from "types";
import { BaseDocument } from "./BaseDocument";


export interface ModuleDocument extends BaseDocument {
  // The key to use in URLs
  alias: string;
  ruleset: {
    ref: Ref64;
    name?: string;
  }
}
