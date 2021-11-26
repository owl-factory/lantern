import { CampaignDataController, CampaignManager } from "controllers/data/campaign";
import { CampaignDocument, SceneDocument } from "types/documents";

export enum GameMode {
  Multiplayer,
  SceneBuilder,
}

export enum GameStatus {
  Preload,
  Loading,
  Ready,
  Error,
}

export abstract class BaseGameController {
  public $status: GameStatus = GameStatus.Preload;
  protected abstract $mode: GameMode;

  public $campaign: CampaignDocument | null = null;

  public get status(): GameStatus { return this.$status; }
  public set status(value: GameStatus) { this.$status = value; }
  public get mode(): GameMode { return this.$mode; }

  public get campaign(): CampaignDocument | null { return this.$campaign; }
  public set campaign(value: CampaignDocument | null) { this.$campaign = value; }
  public abstract loadCampaign(ref: string | null | undefined): void;

  public addScene(scene: SceneDocument) {
    if (!this.campaign) { return; }
    if (!this.campaign.scenes) { this.campaign.scenes = []; }
    this.campaign.scenes.push({ ref: scene.ref });
    if (!this.campaign.activeScene) { this.campaign.activeScene = { ref: scene.ref }; }

    this.save();
  }

  public abstract load(): void;
  public abstract reset(): void;
  public async save(): Promise<void> {
    if (!this.campaign) { return; }
    const campaign = await CampaignDataController.update(this.campaign.ref, this.campaign);
    if (!campaign) { return; }
    this.campaign = campaign;
  }
}