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

  public init() {
    this.add("")
  }

  /**
   * Loads in the layer objects 
   * @param data The layer data to import into the controller
   */
  public load(data: LayerData) {

  }

  /**
   * Packages the data into a format that can be saved to the database and returns it
   */
  public save(): LayerData {

  }

  public add(name: string) {

  }

  private _create(name: string, key: string) {
    const layer = new Container();
    layer.name = 
    
    this.layers[key] = new Container();

  }
}

export const LayerController = new $LayerController();
