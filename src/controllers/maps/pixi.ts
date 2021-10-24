import { Application } from "@pixi/app";
import { DisplayObject } from "@pixi/display";
import { MapController } from "./map";

/**
 * Handles the Pixi Application integration of the Map.
 */
class $PixiController {
  public app: Application;

  constructor() {
    this.app = new Application({});
    window.addEventListener('resize', (event) => resizeApp(this.app, event));
  }

  /**
   * The application to place the PixiJS instance
   * @param app The new application on the page
   */
  public setApp(app: Application) {
    this.app = app;
    MapController.init();
  }

  /**
   * Adds one or many children to the app's stage
   * @param children The children to add to the app
   */
  public addChild<T extends DisplayObject[]>(...children: T) {
    this.requireApp();
    return this.app?.stage.addChild<T>(...children);
  }

  /**
   * Safety function to ensure that the App is loaded
   */
  protected requireApp() {
    if (this.app === undefined) {
      throw "The Application is required to run PixiJS";
    }
  }
}

/**
 * Resizes the Pixi application to match the current window size
 * @param app The Pixi Application to resize
 * @param event The window resize event
 */
function resizeApp(app: Application, event: Event) {
  if (event === null || event.target === null) { return; }
  if (!app.renderer) { return; }

  app.renderer.resize(
    (event.target as any).innerWidth || app.renderer.width,
    (event.target as any).innerHeight - 62 || app.renderer.height,
  );

}

export const PixiController = new $PixiController();
