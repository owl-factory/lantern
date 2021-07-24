import { makeAutoObservable } from "mobx";
import { Application } from "pixi.js";
import { Background } from "./Background";
import { Grid } from "./Grid";
import { PropManager } from "./props/PropManager";
import { Scene } from "./Scene";
import { Viewport } from "./Viewport";

export class SceneController {
  protected app: Application;

  protected background: Background;
  protected grid: Grid;
  protected scene: Scene;
  protected viewport: Viewport;
  protected propManager: PropManager;

  constructor(app: Application, autoObserve = true) {
    console.log(app)
    this.app = app;
    this.app.renderer.plugins.interaction.moveWhenInside = true;

    this.background = new Background(this);
    this.viewport = new Viewport(this);
    this.scene = new Scene(this);
    this.grid = new Grid(this);
    this.propManager = new PropManager(this);

    // Registers all child objects to integrate them.
    this.registerAll();

    // We will need to make this toggleable if SceneController is not the top-level
    // controller, such as if this is in a game.
    if (autoObserve) {
      makeAutoObservable(this);
    }
  }

  /**
   * Registers all child objects so that they can begin interacting with one another, turning them on, in a sense
   */
  public registerAll(): void {
    this.background.register();
    this.viewport.register();
    this.scene.register();
    this.grid.register();
  }

  /**
   * Fetches the app
   */
  public getApp(): Application { return this.app; }

  /**
   * Fetches the background manager
   */
  public getBackground(): Background { return this.background; }
  /**
   * Fetches the grid manager
   */
  public getGrid(): Grid { return this.grid; }
  public getPropManager(): PropManager { return this.propManager; }
  /**
   * Fetches the Scene manager
   */
  public getScene(): Scene { return this.scene; }
  /**
   * Fetches the viewport manager
   */
  public getViewport(): Viewport { return this.viewport; }
}
