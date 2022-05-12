import { Ref64 } from "@owl-factory/types";
import { ContentTypeIcon } from "types/enums/contentTypeIcon";
import { BaseDocument } from "./BaseDocument";

export interface ContentTypeDocument extends BaseDocument {
  ruleset: { ref: Ref64 | null; },
  icon: ContentTypeIcon,
}
