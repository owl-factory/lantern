import { RegisterArgs, RenderAPI, RenderEngineAPI } from "..";

import { v4 as uuid } from "uuid";
import { CharacterRenderEngine } from "./CharacterRenderEngine";

export class CharacterRender implements RenderAPI {
  public readonly id: string;
  public readonly parent: CharacterRenderEngine;

  public readonly characterID: string;
  public readonly campaignID: string;
  public readonly sheetID: string;

  public readonly character: any;
  public readonly rules: any;
  public readonly sheet: any;

  constructor(args: RegisterArgs & { renderEngine: RenderEngineAPI}) {
    this.id = uuid();
    this.parent = args.renderEngine as CharacterRenderEngine;

    this.characterID = args.characterID;
    this.campaignID = args.campaignID;
    this.sheetID = args.sheetID;

     // ASYNC
     // ? Do we want to save these references to this Render?
     this.character = this.parent.characterDataEngine.load(args.characterID, this.id);
     this.rules = this.parent.rulesDataEngine.load(args.campaignID, this.id);
     this.sheet = this.parent.sheetDataEngine.load(args.sheetID, this.id);
     // END ASYNC
  }

  /**
   * Frees the data used by this CharacterRender
   * @param render The Render class containing information about the render to free
   * @returns True on success
   */
  public free(): boolean {
    this.parent.characterDataEngine.free(this.characterID, this.id);
    this.parent.rulesDataEngine.free(this.campaignID, this.id);
    this.parent.sheetDataEngine.free(this.sheetID, this.id);

    return true;
  }
}
