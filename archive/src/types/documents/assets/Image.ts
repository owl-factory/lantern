import { FileDocument } from "types/documents";

/**
 * Describes an Image Asset
 */
export interface ImageDocument extends FileDocument {
  height?: number;
  width?: number;
}
