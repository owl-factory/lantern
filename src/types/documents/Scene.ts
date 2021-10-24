import { GridType } from "controllers/maps/SceneController";
import { CharacterDocument, CoreDocument, ImageDocument } from ".";

interface MapImage {
  image: Partial<ImageDocument>;
  x: number;
  y: number;
  scale: number;
}

// Describes a character stored within a scene. Should have 
// enough information for referencing a character document
interface SceneCharacter extends Partial<CharacterDocument> {
  id: string,
  collection: "characters",
}

export interface SceneDocument extends CoreDocument {
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
  characters: SceneCharacter[],


}