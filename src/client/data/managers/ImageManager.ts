import { ImageDocument } from "types/documents";
import { rest } from "utilities/request";
import { DataManager } from "./DataManager";

export const ImageManager = new DataManager<ImageDocument>(
  "image"
);
