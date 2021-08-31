import { ContentTypeIcon } from "types/enums/contentTypeIcon";
import { FaunaRef } from "types/fauna";
import { CoreDocument } from "./CoreDocument";
import { RulesetDocument } from "./Ruleset";

interface PartialRulesetDocument extends Partial<RulesetDocument> {
  id: string;
  ref: FaunaRef;
  collection: string;
}

export interface ContentTypeDocument extends CoreDocument {
  ruleset: PartialRulesetDocument,
  icon: ContentTypeIcon,
}
