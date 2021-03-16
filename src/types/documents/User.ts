import { Severity, modelOptions, prop } from "@typegoose/typegoose";
import { CoreDocument } from "./CoreDocument";

@modelOptions({ schemaOptions: { collection: "users" }, options: { allowMixed: Severity.ALLOW } } )
export class UserDoc extends CoreDocument {

}
