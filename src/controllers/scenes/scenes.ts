import { PassiveReadLevel } from "@owl-factory/cache/enums";
import { isError } from "@owl-factory/errors";
import { AlertController } from "controllers/AlertController";
import { CampaignCache } from "controllers/cache/CampaignCache";
import { SceneCache } from "controllers/cache/SceneCache";
import { action, makeObservable, observable } from "mobx";
import { Ref64 } from "types";
import { CampaignDocument, SceneDocument } from "types/documents";

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
    const scene = await SceneCache.get(id, PassiveReadLevel.Force);
    if (scene === undefined) {
      AlertController.error("The scene could not be found or you do not have permission to view.");
      return;
    }

    const campaign = await CampaignCache.read(scene.campaign?.ref as string) as Partial<CampaignDocument>;
    if (campaign === undefined || isError(campaign)) {
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
    const campaign = await CampaignCache.read(ref);
    if (campaign === undefined) {
      AlertController.error("An error occured while trying to load the campaign");
      return;
    }
    this.campaign = campaign;
    this.campaignID = this.campaign?.ref as string;
  }

  public async setScene(ref: Ref64) {
    const scene = await SceneCache.get(ref);
    if (scene === undefined) {
      AlertController.error("The scene could not be found or you do not have permission to view.");
    }
  }

  public async newScene() {
    if (!this.campaignID) { return; }
    const scene = await SceneCache.create(
      { name: "Untitled", campaign: {ref: this.campaignID }}
    ) as Partial<SceneDocument>;

    if (!scene) { return; }
    this.scene = scene;
    this.sceneID = scene?.ref as string;
  }
}

export const SceneController = new $SceneController();
