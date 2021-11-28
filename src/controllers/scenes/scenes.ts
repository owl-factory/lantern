import { SceneDataController } from "controllers/data/scene";
import { BaseGameController } from "controllers/multiplayer/BaseGameController";
import { action, makeObservable, observable } from "mobx";
import { Ref64 } from "types";
import { SceneDocument } from "types/documents";
import { GridType } from "types/enums/gridType";

class $SceneController {
  public parent: BaseGameController | null = null;
  public $scene: SceneDocument | null = null;
  public $allScenes: Partial<SceneDocument>[] = [];
  public $allScenesUpdatedAt: number = 0;

  constructor() {
    this.scene = null;

    makeObservable(this, {
      parent: observable,
      $scene: observable,
      $allScenes: observable,
      $allScenesUpdatedAt: observable, 

      
      new: action,
      reset: action,
      load: action,
      setScene: action,
    });
  }

  public get scene() { return this.$scene; }
  public set scene(value: SceneDocument | null) {
    this.$scene = value;
  }

  public get allScenes() { return this.$allScenes; }
  public set allScenes(value: Partial<SceneDocument>[]) { this.$allScenes = value; }
  public get allScenesUpdatedAt() { return this.$allScenesUpdatedAt; }

  public async new() {
    this.save();

    if (this.parent === null || this.parent.campaign === null) { 
      return;
    }

    // TODO - this should be it's own document
    const scene: Partial<SceneDocument> = {
      name: "Untitled Scene",
      campaign: { ref: this.parent?.campaign?.ref },
      map: {
        height: 640,
        width: 640,
        backgroundColor: "#555555",
      },
      grid: {
        type: GridType.Squares,
        size: 64,
      },
      characters: [],
    }
    const newScene = await SceneDataController.create(scene);
    if (!newScene) { return; }
    this.scene = newScene;
    this.parent.addScene(this.scene);
  }

  public async save() {
    // TODO - write to Manager
  }

  public init() {
    this.reset();
    // TODO - init & load in other controllers that we need. Base on feature toggles?
  }

  public reset() {
    this.scene = null;
    this.allScenes = [];
  }

  /**
   * Loads a scene into the scene controller from the database
   * @param id The ID of the scene to load into the SceneController
   */
  public async load() {
    
  }

  public async setScene(scene: SceneDocument | null) {
    this.reset();
    if (scene === undefined || scene === null) { return; }
    this.scene = scene;
    this.load();
  }
}

export const SceneController = new $SceneController();
