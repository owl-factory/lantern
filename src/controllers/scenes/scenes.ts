import { AlertController } from "@owl-factory/alerts";
import { CampaignData } from "controllers/data/CampaignData";
import { SceneData } from "controllers/data/SceneData";
import { action, makeObservable, observable } from "mobx";
import { CampaignDocument, SceneDocument } from "types/documents";
import { Ref64 } from "@owl-factory/types";

class $SceneController {
  public campaignID: string;
  public sceneID: string;

  public campaign: Partial<CampaignDocument> | null;
  public scene: Partial<SceneDocument> | null;

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
    const scene = SceneData.get(id);
    if (scene === undefined) {
      AlertController.error("The scene could not be found or you do not have permission to view.");
      return;
    }

    const campaign = await CampaignData.get(scene.campaign?.ref as string) as Partial<CampaignDocument>;
    if (campaign === undefined) {
      AlertController.error("An error occured while trying to load the campaign");
      return;
    }

    this.sceneID = id;
    this.campaignID = campaign.ref as string;

    this.scene = scene;
    this.campaign = campaign;
  }

  public async save() {
    return;
  }

  public async setCampaign(ref: Ref64) {
    const campaign = await CampaignData.get(ref);
    if (campaign === undefined) {
      AlertController.error("An error occured while trying to load the campaign");
      return;
    }
    this.campaign = campaign;
    this.campaignID = this.campaign?.ref as string;
  }

  public async setScene(ref: Ref64) {
    const scene = await SceneData.get(ref);
    if (scene === undefined) {
      AlertController.error("The scene could not be found or you do not have permission to view.");
    }
  }

  public async newScene() {
    return;
  }
}

export const SceneController = new $SceneController();
