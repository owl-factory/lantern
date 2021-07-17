import { GridType } from "types/enums/scene";
import { Actor, Prop } from "types/reroll/scene";
import { CoreDocument } from "./CoreDocument";

export interface SceneDocument extends CoreDocument {
  props: (Prop | Actor)[];
  grid: {
    width: number;
    height: number;
    tileWidth: number;
    tileHeight: number;
    type: GridType;
  }
  imageUsageCount: Record<string, number>;
  characterUsageCount: Record<string, number>;
}
