import { ImageManager } from "controllers/data/image";
import { ObservablePoint, Sprite, Texture } from "pixi.js";
import { MapController } from "./map";

// Entity Controller? Token Controller?
class $TokenController {


  /**
   * Drops a new entity onto the map
   */
  public async add(id: string, x: number, y: number) {
    const image = ImageManager.get(id);
    console.log(image)
    if (!image) { return; }
    const sprite = new Sprite(await Texture.fromURL(image.src));
    sprite.x = x;
    sprite.y = y;
    sprite.anchor.set(0.5, 0.5);
    sprite.zIndex = 1000000;

    MapController.map.addChild(sprite);
  }
}

export const TokenController = new $TokenController();
