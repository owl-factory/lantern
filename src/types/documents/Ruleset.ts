import { Severity, getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { CoreDocument } from "./CoreDocument";

@modelOptions({ schemaOptions: { collection: "rulesets" }, options: { allowMixed: Severity.ALLOW } } )
export class RulesetDoc extends CoreDocument {
  // The default module used for this ruleset. Any content added to the ruleset is added
  // to this default module
  @prop()
  defaultModuleID?: string;
}

export const RulesetModel = getModelForClass(RulesetDoc, {schemaOptions: { collection: "rulesets" } });
