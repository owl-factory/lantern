import { Ref64 } from "types";
import { ContentTypeIcon } from "types/enums/contentTypeIcon";
import { FaunaRef } from "types/fauna";
import { ContentTypeDocument } from ".";
import { CoreDocument } from "./CoreDocument";
import { RulesetDocument } from "./Ruleset";


export interface ContentDocument extends CoreDocument {
  type: { ref: Ref64; },
  ruleset: { ref: Ref64; },
}
