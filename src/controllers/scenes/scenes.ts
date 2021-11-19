import { AlertController } from "controllers/AlertController";
import { CampaignDataController } from "controllers/data/campaign";
import { SceneDataController, SceneManager } from "controllers/data/scene";
import { action, makeObservable, observable } from "mobx";
import { Ref64 } from "types";
import { CampaignDocument, SceneDocument } from "types/documents";

class $SceneController {
  public campaignID: string;
  public sceneID: string;

  public campaign: CampaignDocument | null;
  public scene: SceneDocument | null;

  constructor() {
    this.campaignID = "";
    this.sceneID = "";

    this.campaign = null;
    this.scene = null;

    makeObservable(this, {
      campaignID: observable,
      sceneID: observable,
      campaign: observable,
      scene: observable,
      reset: action,
      resetScene: action,
      load: action,
      setCampaign: action,
    });
  }

  public init() {
    this.reset();
    // TODO - init & load in other controllers that we need. Base on feature toggles?
  }

  public reset() {
    this.campaignID = "";
    this.resetScene();
  }

  public resetScene() {
    this.sceneID = "";
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

    this.sceneID = id;
    this.campaignID = campaign.ref;

    this.scene = scene;
    this.campaign = campaign;
  }

  public async save() {
    return;
  }

  public async setCampaign(ref: Ref64) {
    const campaign = await CampaignDataController.read(ref);
    if (campaign === undefined) {
      AlertController.error("An error occured while trying to load the campaign");
      return;
    }
    this.campaign = campaign;
    this.campaignID = campaign.ref;
  }

  public async setScene(ref: Ref64) {
    const scene = await SceneDataController.read(ref);
    if (scene === undefined) {
      AlertController.error("The scene could not be found or you do not have permission to view.");
    }
  }

  public async newScene() {
    if (!this.campaignID) { return; }
    const scene = await SceneDataController.create(
      { name: "Untitled", campaign: {ref: this.campaignID }}
    );

    if (!scene) { return; }
    this.scene = scene;
    this.sceneID = scene?.ref;
  }
}

export const SceneController = new $SceneController();
