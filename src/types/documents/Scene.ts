import { GridType } from "controllers/maps/SceneController";
import { Ref64 } from "@owl-factory/types";
import { BaseDocument } from "./BaseDocument";

interface MapImage {
  image: { ref: Ref64; src: string; };
  x: number;
  y: number;
  scale: number;
}

export interface SceneDocument extends BaseDocument {
  campaign: { ref: Ref64; };

  // Defines the base map and size of the scene
  map: {
    height: number;
    width: number;
    backgroundColor: string; // A hex value for the background color
    // TODO - background images.
    backgroundImages?: MapImage[];
  };

  grid: {
    type: GridType;
    size: number;
  },

  // A list of all characters in this scene
  characters: { ref: Ref64; }[],
}
