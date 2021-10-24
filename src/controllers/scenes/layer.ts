import { Container } from "@pixi/display";

interface LayerSubdocument {
  name: string,
  key: string,
}


interface LayerData {
  layers: Record<string, LayerSubdocument>
  order: string[];
}

class $LayerController {
  public layers: Record<string, Container>;

  constructor() {
    this.layers = {};
  }

  /**
   * Initializes the layers controller
   */
  public init() {
    this.reset();
  }

  /**
   * Loads in the layer objects 
   * @param data The layer data to import into the controller
   */
  public load(data: LayerData) {
    return;
  }

  /**
   * Packages the data into a format that can be saved to the database and returns it
   */
  public save(): LayerData {
    throw "Function not implemented";
  }

  public reset(): void {
    return;
  }

  public add(name: string) {
    return;
  }
}

export const LayerController = new $LayerController();
