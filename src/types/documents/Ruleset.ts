import { Severity, getModelForClass, modelOptions } from "@typegoose/typegoose";
import { CoreDocument } from "./CoreDocument";

@modelOptions({ options: { allowMixed: Severity.ALLOW } } )
export class RulesetDoc extends CoreDocument {
}

export const RulesetModel = getModelForClass(RulesetDoc);
