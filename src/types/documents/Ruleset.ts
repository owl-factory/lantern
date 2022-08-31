import { ConversionMap } from "@owl-factory/database/postgres";
import { Ref64, UUID } from "@owl-factory/types";
import { DataType } from "ts-postgres";
import { BaseDocument, BaseDocumentV2 } from "./BaseDocument";
import { StaticVariable } from "./subdocument/StaticVariable";

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

export interface RulesetDocumentV2 extends BaseDocumentV2 {
  id: UUID;
  name: string; // The name of the ruleset
  owner_id: UUID; // The owner of the ruleset
}

export const RulesetConversionMap: ConversionMap<RulesetDocumentV2> = {
  id: DataType.Uuid,
  name: DataType.Text,
  owner_id: DataType.Uuid,
};
