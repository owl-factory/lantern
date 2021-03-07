import { Severity, getModelForClass, modelOptions } from "@typegoose/typegoose";
import { CoreDocument } from "./CoreDocument";

@modelOptions({ schemaOptions: { collection: "modules" }, options: { allowMixed: Severity.ALLOW } } )
export class ModuleDoc extends CoreDocument {
  rulesetID?: string;
}

export const ModuleModel = getModelForClass(ModuleDoc, {schemaOptions: { collection: "modules" } });
