import { GridType } from "types/enums/scene";
import { Actor, Prop } from "types/reroll/scene";
import { ImageDocument } from "./assets";
import { CoreDocument } from "./CoreDocument";

export interface SceneDocumentGrid {
  size: number;
  type: GridType;
}

interface SceneDocumentScene {
  height: number;
  width: number;
}

interface PropDocument {
  x: number;
  y: number;
  height: number;
  width: number;

  image: ImageDocument;
}

/**
 * Represents a scene and all information contained therein
 */
export interface SceneDocument extends CoreDocument {
  grid: SceneDocumentGrid;
  props: Record<string, PropDocument>;
  scene: SceneDocumentScene;
}
