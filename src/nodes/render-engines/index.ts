// The arguments required for the register action
export interface RegisterArgs {
  characterID: string;
  campaignID: string;
  // Ruleset can be ignored because campaigns have a base ruleset included
  sheetID: string;
}

// A standard interface used for all RenderEngines such that they can be replaced with dependency injection
// and upgraded or changed on an as-needed basis
export interface RenderEngineAPI {
  register: (args: RegisterArgs) => RenderAPI;
}

// A statndard interface used for all Renders
export interface RenderAPI {
  free: () => boolean;
}
