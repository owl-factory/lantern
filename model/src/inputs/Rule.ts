import { InputType, Field } from "type-graphql";
import { Rule } from "../documents";
import { CoreInput } from "./CoreInput";

/**
 * Describes the fields that the user may add or update in the rule document
 */
@InputType()
class RuleInput extends CoreInput implements Partial<Rule> {
}

/**
 * Describes the fields that the user may set only when creating the rule document
 */
@InputType()
export class CreateRuleInput extends RuleInput implements Partial<Rule> {
  @Field({ nullable: true })
  gameSystemID?: string;
}

export class UpdateRuleInput extends RuleInput implements Partial<Rule>{};
