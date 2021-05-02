import { Ref } from "types/user";
import { CoreDocument } from ".";

/**
 * The user object for the user's core data for use with NextAuth
 */
export class UserProfileDoc extends CoreDocument {
  public rulesets?: Ref;
}
