import { AssetSource } from "types/enums/assetSource";
import { BaseDocument } from "../BaseDocument";

export interface AssetDocument extends BaseDocument {
  src: string;
  sizeInBytes: number;
  source: AssetSource; // The method that the asset was created through
  pixiLoadable?: boolean; // Indicates that the image can be loaded into pixiJS.
}
