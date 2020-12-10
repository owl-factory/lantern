import { CoreDocument } from "./CoreDocument";
import { getModelForClass } from "@typegoose/typegoose";
import { ObjectType } from "type-graphql";

/**
 * Describes the user object
 */
@ObjectType()
export class User extends CoreDocument {
}

export const UserModel = getModelForClass(User);
