import { makeAutoObservable } from "mobx";
import { Application } from "pixi.js";
import { FaunaRef } from "types/fauna";
import { Background } from "./Background";
import { Grid } from "./Grid";
import { PropManager } from "./props/PropManager";
import { SaveLoader } from "./SaveLoader";
import { Scene } from "./Scene";
import { Viewport } from "./Viewport";

export class SceneController {
  protected app: Application;

  protected background: Background;
  protected grid: Grid;
  protected scene: Scene;
  protected viewport: Viewport;
  protected props: PropManager;
  protected saveLoader: SaveLoader;

  private sceneID?: string;
  // The human-readable name of the scene
  protected name = "Untitled Scene";
  protected campaign?: FaunaRef;

  constructor(app: Application, autoObserve = true) {
    console.log(app)
    this.app = app;
    this.app.renderer.plugins.interaction.moveWhenInside = true;

    this.background = new Background(this);
    this.viewport = new Viewport(this);
    this.scene = new Scene(this);
    this.grid = new Grid(this);
    this.props = new PropManager(this);
    this.saveLoader = new SaveLoader(this);

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

  public getID(): string | undefined { return this.sceneID; }
  public setID(sceneID: string): void { this.sceneID = sceneID; }

  public getName(): string { return this.name; }
  public setName(name: string): void { this.name = name; }

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
  public getPropManager(): PropManager { return this.props; }
  public getSaveLoader(): SaveLoader { return this.saveLoader; }
  /**
   * Fetches the Scene manager
   */
  public getScene(): Scene { return this.scene; }
  /**
   * Fetches the viewport manager
   */
  public getViewport(): Viewport { return this.viewport; }
}
