import { Viewport } from "pixi-viewport";
import { MapController } from "./map";
import { PixiController } from "./pixi";

/**
 * Handles creating and managing the viewport of the map
 */
class $ViewportController {
  public viewport: Viewport;

  constructor() {
    this.viewport = new Viewport();
  }

  /**
   * Initializes the viewport
   */
  public init(): void {
    this.viewport = new Viewport({
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
    this.viewport.addChild(MapController.map);

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
