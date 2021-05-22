import { AssetDocument } from "types/documents";

export interface ImageDocument extends AssetDocument {
  height?: number;
  width?: number;
}