import { InteractionData, Point, Sprite } from "pixi.js";
import { ImageDocument } from "types/documents";
import { CharacterDocument } from "types/documents/Character";

export interface Prop extends Sprite {
  // Stored values
  key: string;
  image: ImageDocument;

  // Unstored Values
  data?: InteractionData | null;
  dragging?: boolean;
  dragPoint?: Point;
  originalPosition?: {
    x: number;
    y: number;
  }

  
}

export interface Actor extends Prop {
  character: CharacterDocument;
}
