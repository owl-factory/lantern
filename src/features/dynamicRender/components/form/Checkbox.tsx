import { checkboxAttributes } from "features/dynamicRender/data/attributes/form/checkbox";
import { useAttributes } from "features/dynamicRender/hooks/useAttributes";
import { useFormValue } from "features/dynamicRender/hooks/useFormValue";
import { CheckboxAttributes } from "features/dynamicRender/types/attributes/form/checkbox";
import { GetOptions, QuerySource } from "features/dynamicRender/types/query";
import { RenderComponentProps } from "features/dynamicRender/types/render";
import { check, isChecked, uncheck } from "features/dynamicRender/utils/check";
import { buildQueryOptionsFromAttributes } from "features/dynamicRender/utils/query";
import { ChangeEvent, useMemo } from "react";

/**
 * Renders a checkbox for the Dynamic Render
 */
export function Checkbox(props: RenderComponentProps) {
  const { attributes } = useAttributes<CheckboxAttributes>(props.node, checkboxAttributes);
  const options = useMemo<GetOptions>(() => buildQueryOptionsFromAttributes(attributes), [attributes]);

  const persistState = options.source !== QuerySource.Invalid;

  const { value: storedValue, update }: { value: string; update: (value: string) => void } = useFormValue<string>(
    options,
    "",
    !persistState
  );

  const checked = isChecked(storedValue, attributes.value);

  /**
   * Updates the form value on change.
   * @param e - The triggering change event
   */
  function onChange(e: ChangeEvent<HTMLInputElement>) {
    if (!persistState) return;
    if (!e || !e.target) return;

    let newStoredValue: string;
    if (checked) {
      newStoredValue = uncheck(storedValue, attributes.value);
    } else {
      newStoredValue = check(storedValue, attributes.value);
    }
    e.target.checked = !checked;
    update(newStoredValue);
  }

  return <input type="checkbox" onChange={onChange} defaultChecked={checked} value={attributes.value} />;
}
