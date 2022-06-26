import { Ref64 } from "@owl-factory/types";
import { BaseDocument } from "./BaseDocument";


export interface ActorSheetDocument extends BaseDocument {
  ruleset: {
    ref: Ref64; // The ref for the ruleset this actor sheet uses
  }
  xml: string; // The raw XML used to build the page
}
