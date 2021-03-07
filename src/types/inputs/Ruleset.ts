import { IsDefined } from "class-validator";
import { CoreInput } from "./";

class RulesetInput extends CoreInput {
  @IsDefined()
  name!: string;
}
export class CreateRulesetInput extends RulesetInput {}
export class UpdateRulesetInput extends RulesetInput {}
