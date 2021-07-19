import { makeAutoObservable } from "mobx";
import { Application } from "pixi.js";
import { Background } from "./Background";
import { Grid } from "./Grid";
import { Scene } from "./Scene";
import { Viewport } from "./Viewport";

export class SceneController {
  protected height: number;
  protected width: number;

  protected app: Application;

  protected background: Background;
  protected grid: Grid;
  protected scene: Scene;
  protected viewport: Viewport;

  constructor(app: Application) {
    this.app = app;
    this.background = new Background(this);
    this.viewport = new Viewport(this);
    this.scene = new Scene(this);
    this.grid = new Grid(this);

    this.height = 128;
    this.width = 128;

    makeAutoObservable(this);
    this.registerAll();
  }

  public registerAll(): void {
    this.background.register();
    this.viewport.register();
    this.scene.register();
    this.grid.register();
  }

  public getApp(): Application { return this.app; }
  public getHeight(): number { return this.width; }
  public getWidth(): number { return this.width; }

  public getBackground(): Background { return this.background; }
  public getGrid(): Grid { return this.grid; }
  public getScene(): Scene { return this.scene; }
  public getViewport(): Viewport { return this.viewport; }
}
