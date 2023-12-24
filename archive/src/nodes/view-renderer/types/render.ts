import { RenderState } from "./state";

// Describes a Render
export interface Render {
  viewID: string; // The ID of the view this render uses
  sources: RenderSources; // The different data sources this render may draw upon
  state: RenderState; // The current state of this render. This can change and should be observable
}

// Links the different dynamic data sources that may be used to render a View
export interface RenderSources {
  actorID?: string; // The ID of the actor
  campaignID?: string; // The ID of the campaign
  contentID?: string; // The ID of an individual content item
  rulesetID?: string; // The ID of the ruleset
  sheetID?: string; // The ID of the sheet. This may be identical to the viewID, but is not gauranteed
}
