import { BaseDocument } from "./BaseDocument";
import { StaticVariable } from "./subdocument/StaticVariable";


//TODO make this an interface that adds it's own functionality
export interface RulesetDocument extends BaseDocument {
  alias: string;

  actorFields: Record<string, unknown>;
  staticVariables: Record<string, StaticVariable>;

  // Indicates whether a ruleset is official or not. Official rulesets are those that are offically supported
  // on the app, be they first party (D&D 5e) or third party (Star Wars 5e).
  isOfficial: boolean;
  // Indicates if non-owners may see this ruleset or not. Newly created rulesets are not public by default
  isPublic: boolean;

  // Indicates if this ruleset has been flagged and disabled for any reason, such as if it contains
  // copyrighted material or is against TOS. Should be used in conjunction with setting isPublic to false
  isLocked: boolean;
}
