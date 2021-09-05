import { CoreDocument } from "../CoreDocument";

export interface AssetDocument extends CoreDocument {
  src?: string;
  sizeInBytes?: number;
  isExternal?: boolean;
}
