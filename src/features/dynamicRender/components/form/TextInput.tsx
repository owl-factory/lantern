import { useFormValue } from "features/dynamicRender/hooks/useFormValue";
import { GetOptions } from "features/dynamicRender/types/storage";
import { observer } from "lib/mobx";
import { ChangeEvent, useMemo } from "react";

/**
 * Renders a text input for the Dynamic Render
 */
function _TextInput() {
  const options: GetOptions = useMemo(() => ({ source: "character", key: "name" }), []);
  const { value, update } = useFormValue<string>(options, "");

  /**
   * Updates the form value on change.
   * @param e - The triggering change event
   */
  function onChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e || !e.target) return;
    update(e.target.value);
  }

  return <input type="text" onChange={onChange} value={value} />;
}

/** {@inheritDoc _TextInput} */
export const TextInput = observer(_TextInput);
