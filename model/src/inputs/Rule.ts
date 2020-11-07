import { InputType, Field } from "type-graphql";
import { Rule } from "../documents";
import { CoreInput } from "./CoreInput";

/**
 * Describes the fields that the user may add or update in the rule document
 */
@InputType()
export class RuleInput extends CoreInput implements Partial<Rule> {
  @Field({ nullable: true })
  gameSystemID?: string;
}