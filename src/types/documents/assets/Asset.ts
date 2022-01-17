import { AssetSource } from "types/enums/assetSource";
import { CoreDocument } from "../CoreDocument";

export interface AssetDocument extends CoreDocument {
  src: string;
  sizeInBytes: number;
  source: AssetSource; // The method that the asset was created through
  pixiLoadable?: boolean; // Indicates that the image can be loaded into pixiJS.
}
