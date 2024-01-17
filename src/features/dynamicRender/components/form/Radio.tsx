import { radioAttributes } from "features/dynamicRender/data/attributes/form/radio";
import { useAttributes } from "features/dynamicRender/hooks/useAttributes";
import { useFormValue } from "features/dynamicRender/hooks/useFormValue";
import { RadioAttributes } from "features/dynamicRender/types/attributes/form/radio";
import { NodeType } from "features/dynamicRender/types/node";
import { GetOptions } from "features/dynamicRender/types/query";
import { RenderComponentDefinition, RenderComponentProps } from "features/dynamicRender/types/render";
import { buildQueryOptionsFromAttributes } from "features/dynamicRender/utils/query";
import { ChangeEvent, useMemo } from "react";

/**
 * Renders a radio button for the Dynamic Render
 */
export function Radio(props: RenderComponentProps) {
  const { attributes } = useAttributes<RadioAttributes>(props.node, radioAttributes);
  const options = useMemo<GetOptions>(() => buildQueryOptionsFromAttributes(attributes), [attributes]);
  const { value: storedValue, update } = useFormValue<string>(options, "");

  /**
   * Updates the form value on change.
   * @param e - The triggering change event
   */
  function onChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e || !e.target) return;
    update(e.target.value);
  }

  return <input type="radio" onChange={onChange} checked={attributes.value === storedValue} value={attributes.value} />;
}

export const radioBundle: RenderComponentDefinition = {
  Component: Radio,
  nodeType: NodeType.Radio,
  attributes: radioAttributes,
  allowsChildren: false,
};
