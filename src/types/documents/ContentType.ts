import { Ref64 } from "@owl-factory/types";
import { ContentTypeIcon } from "types/enums/contentTypeIcon";
import { BaseDocument } from "./BaseDocument";

export interface ContentTypeDocument extends BaseDocument {
  // Access
  alias: string;
  ruleset: {
    ref: Ref64 | null;
    name: string;
  },
  parent: {
    ref: Ref64 | null;
    name?: string;
  }

  icon: ContentTypeIcon,
}
