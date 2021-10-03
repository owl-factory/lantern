import { ContentTypeDocument } from "types/documents";
import { rest } from "utilities/request";
import { DataManager } from "./DataManager";

export const ContentTypeManager = new DataManager<ContentTypeDocument>(
  "contentType"
);
