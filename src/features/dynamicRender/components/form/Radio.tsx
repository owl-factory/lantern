import { useFormValue } from "features/dynamicRender/hooks/useFormValue";
import { GetOptions } from "features/dynamicRender/types/query";
import { RenderComponentProps } from "features/dynamicRender/types/render";
import { buildQueryOptions } from "features/dynamicRender/utils/query";
import { getAttributeValue } from "features/dynamicRender/utils/render";
import { ChangeEvent, useMemo } from "react";

/**
 * Renders a radio button for the Dynamic Render
 */
export function Radio(props: RenderComponentProps) {
  const checkValue = useMemo(() => getAttributeValue(props.node, "value", "on"), [props.node]);
  const options = useMemo<GetOptions>(() => buildQueryOptions(props.node), [props.node]);
  const { value: storedValue, update } = useFormValue<string>(options, "");

  /**
   * Updates the form value on change.
   * @param e - The triggering change event
   */
  function onChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e || !e.target) return;
    update(e.target.value);
  }

  return <input type="radio" onChange={onChange} checked={checkValue === storedValue} value={checkValue} />;
}
