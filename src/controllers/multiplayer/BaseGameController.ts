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
  // The core status of loading of the current game
  public $status: GameStatus = GameStatus.Preload;
  // The mode that the game is in, such as multiplayer, singleplayer, or scene builder.
  protected abstract $mode: GameMode;

  // The currently loaded campaign. Null values indicate no campaign. 
  public $campaign: CampaignDocument | null = null;

  // Fetches the current game status
  public get status(): GameStatus { return this.$status; }
  // Sets a new status
  public set status(value: GameStatus) { this.$status = value; }
  // Fetches the current mode. No setter is used
  public get mode(): GameMode { return this.$mode; }

  // Fetches the current campaign, if any
  public get campaign(): CampaignDocument | null { return this.$campaign; }
  // Sets the campaign. Override to set values down the line
  public set campaign(value: CampaignDocument | null) { this.$campaign = value; }
  // TODO - not sure
  public abstract loadCampaign(ref: string | null | undefined): void;

  /**
   * Adds a new scene to the currently loaded campaign
   * TODO - move to the game side
   * @param scene The new scene to add
   */
  public addScene(scene: SceneDocument): void {
    if (!this.campaign) { return; }
    if (!this.campaign.scenes) { this.campaign.scenes = []; }
    this.campaign.scenes.push({ ref: scene.ref });
    if (!this.campaign.activeScene) { this.campaign.activeScene = { ref: scene.ref }; }

    this.save();
  }

  // Loads all of the required and secondary deferred data needed for the current game
  public abstract load(): Promise<void>;
  // Resets the game and all descendents. To be used when the page changes
  public abstract reset(): void;
  // Saves all changed information
  public abstract save(): Promise<void>;
}