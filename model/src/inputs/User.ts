import { InputType } from "type-graphql";
import { User } from "../documents";
import { CoreInput } from "./CoreInput";

/**
 * Describes the fields that the user may add or update in the user document
 */
@InputType()
export class UserInput extends CoreInput implements Partial<User> {
}

@InputType()
export class CreateUserInput extends UserInput implements Partial<User>{}
@InputType()
export class UpdateUserInput extends UserInput implements Partial<User>{}