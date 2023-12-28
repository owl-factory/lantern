import { useFormValue } from "features/dynamicRender/hooks/useFormValue";
import { GetOptions } from "features/dynamicRender/types/storage";
import { ChangeEvent, useMemo } from "react";

/**
 * Renders a number input for the Dynamic Render
 */
export function NumberInput() {
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

  return <input type="number" onChange={onChange} value={value} />;
}
