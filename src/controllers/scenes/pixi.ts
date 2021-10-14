import { Application } from "@pixi/app";
import { DisplayObject } from "@pixi/display";
import { MapController } from "./map";


class $PixiController {
  public app: Application;

  constructor() {
    this.app = new Application({});
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

export const PixiController = new $PixiController();
