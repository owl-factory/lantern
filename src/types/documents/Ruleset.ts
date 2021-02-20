import { getModelForClass, modelOptions, Severity } from "@typegoose/typegoose";
import { CoreDocument } from "./CoreDocument";

@modelOptions({ options: { allowMixed: Severity.ALLOW } } )
export class Ruleset extends CoreDocument {
}

export const RulesetModel = getModelForClass(Ruleset);
