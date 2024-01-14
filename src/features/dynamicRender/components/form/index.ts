import { checkboxBundle } from "features/dynamicRender/components/form/Checkbox";
import { numberInputBundle } from "features/dynamicRender/components/form/NumberInput";
import { radioBundle } from "features/dynamicRender/components/form/Radio";
import { textAreaBundle } from "features/dynamicRender/components/form/TextArea";
import { textInputBundle } from "features/dynamicRender/components/form/TextInput";
import { registerBundle } from "features/dynamicRender/utils/registry";

/**
 * Registers the form components
 */
export function registerForm() {
  registerBundle(checkboxBundle);
  registerBundle(numberInputBundle);
  registerBundle(radioBundle);
  registerBundle(textAreaBundle);
  registerBundle(textInputBundle);
}
