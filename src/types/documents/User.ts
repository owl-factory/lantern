import { CoreDocument } from "./CoreDocument";
import { getModelForClass } from "@typegoose/typegoose";

/**
 * Describes the user object
 */
export class User extends CoreDocument {
}

export const UserModel = getModelForClass(User);
