import { CampaignManager } from "controllers/data/campaign";
import { RulesetManager } from "controllers/data/ruleset";
import { SceneManager } from "controllers/data/scene";
import { SceneController } from "controllers/scenes/scenes";
import { action, makeObservable, observable } from "mobx";
import { RulesetDocument } from "types/documents";
import { rest } from "utilities/request";
import { BaseGameController, GameMode, GameStatus } from "./BaseGameController";

class $GameController extends BaseGameController {
  protected $mode: GameMode = GameMode.Multiplayer;

  public $ruleset: RulesetDocument | null = null;

  constructor() {
    super();

    CampaignManager.load();
    RulesetManager.load();
    SceneManager.load();
    this.status = GameStatus.Preload;

    SceneController.reset();
    SceneController.parent = this;

    makeObservable(this, {
      $status: observable,

      $campaign: observable,
      $ruleset: observable,

      loadCampaign: action,
      loadRuleset: action,

      addScene: action,
      save: action,
    });
  }

  public get ruleset(): RulesetDocument | null { return this.$ruleset; }
  public set ruleset(value: RulesetDocument | null) { this.$ruleset = value; }


  public loadCampaign(ref: string | undefined) {
    // TODO - reset everything downstream
    if (ref === undefined || ref === "" ) { 
      this.campaign = null;
      this.load();
      return;
    }
    const campaign = CampaignManager.get(ref);
    if (campaign === undefined) {
      this.campaign = null;
      this.load();
      return;
    }
    this.campaign = deepCopy(campaign);
    this.load();
  }

  public loadRuleset(ref: string | undefined) {
    if (ref === undefined) {
      this.ruleset = null;
      return;
    }

    const ruleset = RulesetManager.get(ref);
    this.ruleset = ruleset || null;
  }

  public async load() {
    this.status = GameStatus.Loading;
    if (this.campaign === null) {
      this.status = GameStatus.Preload;

      this.ruleset = null;
      return;
    }

    // TODO - load in the full campaign information
    const game = await rest.post<any>(`/api/play`, { ref: this.campaign?.ref });
    if (game.success === false) {
      this.status = GameStatus.Error;
      
      throw game.message;
    }

    RulesetManager.set(game.data.ruleset);
    this.loadRuleset(game.data.ruleset.ref);

    SceneController.setScene(this.campaign?.activeScene?.ref)
  }

  public reset() {
    // TODO - reset everything immediately downstream
  }
}

function deepCopy(data: any) {
  return { ...data };
}

export const GameController = new $GameController();
