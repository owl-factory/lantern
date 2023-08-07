import { Ref64 } from "types";
import { BaseDocument } from "./BaseDocument";
import { StaticVariables } from "./subdocument/StaticVariable";

export interface ActorType {
  name: string; // The name of the actor type, readable to the user ("Player Character, Non-Player Character")
  key: string; // A key unique to a ruleset identifying which actor type an actor belongs to
  description: string; // A brief description identifying the purpose of this actor type
  actorSheet: { ref: Ref64; } // The default, official actor sheet used for this actor type
}

//TODO make this an interface that adds it's own functionality
export interface RulesetDocument extends BaseDocument {
  alias: string;

  // ACTORS //
  actorFields: Record<string, unknown>; // Variable names and types to be used by the actors for this ruleset
  actorTypes: ActorType[]; // The different kinds of actors supported by this ruleset by default

  // Static variables serving as 'rules' and flags and values for the ruleset
  rules: StaticVariables;

  // Indicates whether a ruleset is official or not. Official rulesets are those that are offically supported
  // on the app, be they first party (D&D 5e) or third party (Star Wars 5e).
  isOfficial: boolean;
  // Indicates if non-owners may see this ruleset or not. Newly created rulesets are not public by default
  isPublic: boolean;

  // Indicates if this ruleset has been flagged and disabled for any reason, such as if it contains
  // copyrighted material or is against TOS. Should be used in conjunction with setting isPublic to false
  isLocked: boolean;
}
