import { Severity, modelOptions } from "@typegoose/typegoose";
import { CoreDocument } from "./CoreDocument";

/**
 * The user object for the user's core data for use with NextAuth
 */
@modelOptions({ schemaOptions: { collection: "users" }, options: { allowMixed: Severity.ALLOW } } )
export class UserDoc extends CoreDocument {

}
