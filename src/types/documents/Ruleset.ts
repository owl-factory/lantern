import { Severity, getModelForClass, modelOptions } from "@typegoose/typegoose";
import { CoreDocument } from "./CoreDocument";

@modelOptions({ schemaOptions: { collection: "rulesets" }, options: { allowMixed: Severity.ALLOW } } )
export class RulesetDoc extends CoreDocument {
}

export const RulesetModel = getModelForClass(RulesetDoc, {schemaOptions: { collection: "rulesets" } });
