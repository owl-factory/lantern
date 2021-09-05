import { ContentTypeIcon } from "types/enums/contentTypeIcon";
import { FaunaRef } from "types/fauna";
import { ContentTypeDocument } from ".";
import { CoreDocument } from "./CoreDocument";
import { RulesetDocument } from "./Ruleset";

interface PartialRuleset extends Partial<RulesetDocument> {
  id: string,
  ref: FaunaRef,
  collection: string,
}

interface PartialContentType extends Partial<ContentTypeDocument> {
  id: string,
  ref: FaunaRef,
  collection: string,
  name: string,
  icon: ContentTypeIcon,
}

export interface ContentDocument extends CoreDocument {
  type: PartialContentType,
  ruleset: PartialRuleset,
}
