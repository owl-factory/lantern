import { Ref64 } from "types";
import { ContentTypeIcon } from "types/enums/contentTypeIcon";
import { FaunaRef } from "types/fauna";
import { CoreDocument } from "./CoreDocument";
import { RulesetDocument } from "./Ruleset";

export interface ContentTypeDocument extends CoreDocument {
  ruleset: { ref: Ref64; },
  icon: ContentTypeIcon,
}
