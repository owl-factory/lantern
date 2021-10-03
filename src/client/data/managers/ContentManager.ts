import { ContentDocument } from "types/documents";
import { rest } from "utilities/request";
import { DataManager } from "./DataManager";

export const ContentManager = new DataManager<ContentDocument>(
  "my-content"
);
