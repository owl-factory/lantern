import { IsDefined } from "class-validator";
import { CoreInput } from ".";

class ModuleInput extends CoreInput {
  @IsDefined()
  rulesetID!: string;
}
export class CreateModuleInput extends ModuleInput {}
export class UpdateModuleInput extends ModuleInput {}
