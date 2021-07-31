import { CampaignController } from "client/CampaignController";
import { makeAutoObservable } from "mobx";
import { CampaignDocument, SceneDocument } from "types/documents";

interface GameSystemDocument {

}

export enum EditorState {
  ViewAllCampaigns,
  ViewAllScenes,
}

export class EditorController {
  protected campaign: CampaignController;

  protected activeGameSystem: GameSystemDocument | null = null;
  protected activeCampaign: CampaignDocument | null = null;
  protected activeScene: SceneDocument | null = null;

  protected state: EditorState;

  constructor() {
    this.state = EditorState.ViewAllCampaigns;

    this.campaign = new CampaignController();

    makeAutoObservable(this);
  }

  public getCampaignController(): CampaignController {
    return this.campaign;
  }

  public getState(): EditorState { return this.state; }
  public setState(state: EditorState) {
    this.state = state;
  }
}