import { Application } from "@pixi/app";
import { DisplayObject } from "@pixi/display";
import { MapController } from "./map";


class $PixiController {
  public app: Application;

  constructor() {
    this.app = new Application({});
    // makeObservable(this, {
    //   app: observable,
    //   setApp: action,
    // });
  }

  /**
   * The application to place the PixiJS instance
   * @param app The new application on the page
   */
  public setApp(app: Application) {
    this.app = app;
    // this.map.init();
  }

  public addChild<T extends DisplayObject[]>(...children: T) {
    this.requireApp();
    return this.app?.stage.addChild<T>(...children);
  }

  protected requireApp() {
    if (this.app === undefined) {
      throw "The Application is required to run PixiJS";
    }
  }
}

export const PixiController = new $PixiController();
