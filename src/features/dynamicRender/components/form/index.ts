import { observer } from "lib/mobx";
import { Checkbox } from "./Checkbox";
import { registerComponent } from "features/dynamicRender/utils/registry";
import { NumberInput } from "./NumberInput";
import { TextInput } from "./TextInput";
import { Radio } from "./Radio";
import { TextArea } from "./TextArea";

/**
 * Registers the form components
 */
export function registerForm() {
  registerComponent("Checkbox", observer(Checkbox));
  registerComponent("NumberInput", observer(NumberInput));
  registerComponent("Radio", observer(Radio));
  registerComponent("TextArea", observer(TextArea));
  registerComponent("TextInput", observer(TextInput));
}
