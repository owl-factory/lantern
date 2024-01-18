import { checkboxBundle } from "features/dynamicRender/components/form/Checkbox";
import { numberInputBundle } from "features/dynamicRender/components/form/NumberInput";
import { radioBundle } from "features/dynamicRender/components/form/Radio";
import { textAreaBundle } from "features/dynamicRender/components/form/TextArea";
import { textInputBundle } from "features/dynamicRender/components/form/TextInput";
import { registerComponentDefinition } from "features/dynamicRender/utils/registry";

/**
 * Registers the form components
 */
export function registerForm() {
  registerComponentDefinition(checkboxBundle);
  registerComponentDefinition(numberInputBundle);
  registerComponentDefinition(radioBundle);
  registerComponentDefinition(textAreaBundle);
  registerComponentDefinition(textInputBundle);
}
