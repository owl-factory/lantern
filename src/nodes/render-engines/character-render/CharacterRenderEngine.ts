import { RegisterArgs, RenderEngineAPI } from "..";
import { DataEngineAPI } from "../data-engine";
import { CharacterRender } from "./CharacterRender";



interface ConstructorArgs {
  characterDataEngine: DataEngineAPI,
  rulesDataEngine: DataEngineAPI,
  sheetDataEngine: DataEngineAPI,
}

export class CharacterRenderEngine implements RenderEngineAPI {
  public readonly characterDataEngine: DataEngineAPI; // The Data Engine used for actively handling character data
  public readonly rulesDataEngine: DataEngineAPI; // The Data Engine used for actively handling campaign/rule data
  public readonly sheetDataEngine: DataEngineAPI; // The Data Engine used for actively handling sheet data

  constructor(constructorArgs: ConstructorArgs) {
    this.characterDataEngine = constructorArgs.characterDataEngine;
    this.rulesDataEngine = constructorArgs.rulesDataEngine;
    this.sheetDataEngine = constructorArgs.sheetDataEngine;
  }

  /**
   * Registers a new Character Render
   */
  public register(args: RegisterArgs): CharacterRender {
    const characterRender = new CharacterRender({...args, renderEngine: this});

    // ASYNC
    this.characterDataEngine.load(args.characterID, characterRender.id);
    this.rulesDataEngine.load(args.campaignID, characterRender.id);
    this.sheetDataEngine.load(args.sheetID, characterRender.id);
    // END ASYNC

    return characterRender;
  }
}
