import { GridType } from "types/enums/scene";
import { Actor, Prop } from "types/reroll/scene";
import { CoreDocument } from "./CoreDocument";

export interface SceneDocumentGrid {
  width: number;
  height: number;
  gridWidth: number;
  gridHeight: number;
  gridSize: number;
  type: GridType;
}

/**
 * Represents a scene and all information contained therein
 */
export interface SceneDocument extends CoreDocument {
  props: Record<string, Prop | Actor>;
  grid: SceneDocumentGrid;
  imageUsageCount: Record<string, number>;
  characterUsageCount: Record<string, number>;
}
