import { Severity, modelOptions, prop, Ref } from "@typegoose/typegoose";
import { CoreDocument, RulesetDoc } from ".";

/**
 * The user object for the user's core data for use with NextAuth
 */
@modelOptions({ schemaOptions: { collection: "userProfiles" }, options: { allowMixed: Severity.ALLOW } } )
export class UserProfileDoc extends CoreDocument {
  // NOTE: the userProfile ID should be identical to the user ID
  @prop({ ref:() => RulesetDoc })
  public rulesets?: Ref<RulesetDoc>[];
}
