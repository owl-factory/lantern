import { RegisterArgs, RenderAPI, RenderEngineAPI } from "..";

import { v4 as uuid } from "uuid";
import { CharacterRenderEngine } from "./CharacterRenderEngine";

export class CharacterRender implements RenderAPI {
  public readonly id: string;
  public readonly parent: CharacterRenderEngine;

  public readonly characterID: string;
  public readonly campaignID: string;
  public readonly sheetID: string;

  constructor(args: RegisterArgs & { renderEngine: RenderEngineAPI}) {
    this.id = uuid();
    this.parent = args.renderEngine as CharacterRenderEngine;

    this.characterID = args.characterID;
    this.campaignID = args.campaignID;
    this.sheetID = args.sheetID;
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
