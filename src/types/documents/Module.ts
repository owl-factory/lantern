import { Severity, modelOptions } from "@typegoose/typegoose";
import { CoreDocument } from "./CoreDocument";

@modelOptions({ schemaOptions: { collection: "modules" }, options: { allowMixed: Severity.ALLOW } } )
export class ModuleDoc extends CoreDocument {
  rulesetID?: string;
}
