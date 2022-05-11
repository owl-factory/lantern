import { AssetSource } from "types/enums/assetSource";
import { CoreDocument } from "./CoreDocument";

enum FileType {
  Image
}

export interface FileDocument extends CoreDocument {
  src: string; // The URL to access the document's source.

  sizeInBytes: number; // The size in bytes that the document uses in storage. For all non-uploaded documents, this is 0
  source: AssetSource; // The method that the asset was created through
  isPixiLoadable?: boolean; // Indicates that the image can be loaded into pixiJS.
}
