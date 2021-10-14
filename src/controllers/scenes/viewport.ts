import { Viewport } from "pixi-viewport";
import { MapController } from "./map";
import { PixiController } from "./pixi";


class $ViewportController {
  public viewport: Viewport;

  constructor() {
    this.viewport = new Viewport();
  }

  public init(): void {
    this.viewport = new Viewport({
      screenWidth: 1000,
      screenHeight: 1000,
      worldWidth: 1000,
      worldHeight: 1000,

      interaction: PixiController.app.renderer.plugins.interaction,
    });

    this.viewport
      .drag({ mouseButtons: "middle" })
      .pinch()
      .wheel()
      .decelerate({ friction: 0.95, minSpeed: 0.5 });
    PixiController.addChild(this.viewport);
  }

  /**
   * Centers the viewport
   */
   public center(): void {
    this.viewport.x = (PixiController.app.view.width - MapController.width) / 2;
    this.viewport.y = (PixiController.app.view.height - MapController.height) / 2;
  }
}

export const ViewportController = new $ViewportController();
