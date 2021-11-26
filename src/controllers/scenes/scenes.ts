import { AlertController } from "controllers/AlertController";
import { CampaignDataController } from "controllers/data/campaign";
import { SceneDataController, SceneManager } from "controllers/data/scene";
import { BaseGameController } from "controllers/multiplayer/BaseGameController";
import { action, makeObservable, observable } from "mobx";
import { Ref64 } from "types";
import { SceneDocument } from "types/documents";
import { GridType } from "types/enums/gridType";

class $SceneController {
  public parent: BaseGameController | null = null;
  public $scene: SceneDocument | null = null;
  public allScenes: Ref64[] = [];

  constructor() {
    this.scene = null;

    makeObservable(this, {
      parent: observable,
      $scene: observable,
      new: action,
      reset: action,
      resetScene: action,
      load: action,
    });
  }

  public get scene() { return this.$scene; }
  public set scene(value: SceneDocument | null) {
    this.$scene = value;
  }

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
    this.resetScene();
  }

  public resetScene() {
    this.scene = null;
  }

  /**
   * Loads a scene into the scene controller from the database
   * @param id The ID of the scene to load into the SceneController
   */
  public async load(id: string) {
    const scene = await SceneDataController.read(id);
    if (scene === undefined) {
      AlertController.error("The scene could not be found or you do not have permission to view.");
      return;
    }

    const campaign = await CampaignDataController.read(scene.campaign.ref);
    if (campaign === undefined) {
      AlertController.error("An error occured while trying to load the campaign");
      return;
    }

    this.scene = scene;
  }

  public async setScene(ref?: Ref64) {
    this.reset();
    if (ref === undefined || ref === null) { return; }
    const scene = await SceneDataController.read(ref);
    if (scene === undefined) {
      AlertController.error("The scene could not be found or you do not have permission to view.");
    }
  }

  public async newScene() {
  }
}

export const SceneController = new $SceneController();
