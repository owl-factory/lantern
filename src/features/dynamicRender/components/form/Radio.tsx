import { COMMON_INPUT_ATTRIBUTE_DEFINITIONS } from "features/dynamicRender/data/attributes";
import { useAttributes } from "features/dynamicRender/hooks/useAttributes";
import { useFormValue } from "features/dynamicRender/hooks/useFormValue";
import { AttributeDefinition } from "features/dynamicRender/types/attributes/definition";
import { CommonInputAttributes } from "features/dynamicRender/types/attributes/form/common";
import { NodeType } from "features/dynamicRender/types/node";
import { GetOptions } from "features/dynamicRender/types/query";
import {
  RenderComponentDefinition,
  RenderComponentProps,
} from "features/dynamicRender/types/render";
import { buildQueryOptionsFromAttributes } from "features/dynamicRender/utils/query";
import { ChangeEvent, useMemo } from "react";

export type RadioAttributes = CommonInputAttributes & {
  value: string;
};
export const attributeDefinitions: AttributeDefinition[] = [
  ...COMMON_INPUT_ATTRIBUTE_DEFINITIONS,
  { name: "value", required: true },
];

/**
 * Renders a radio button for the Dynamic Render
 */
export function Radio(props: RenderComponentProps<RadioAttributes>) {
  const { attributes } = useAttributes<RadioAttributes>(props.node, attributeDefinitions);
  const options = useMemo<GetOptions>(
    () => buildQueryOptionsFromAttributes(attributes),
    [attributes]
  );
  const { value: storedValue, update } = useFormValue(options, "");

  /**
   * Updates the form value on change.
   * @param e - The triggering change event
   */
  function onChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e || !e.target) return;
    update(e.target.value);
  }

  return (
    <input
      type="radio"
      onChange={onChange}
      checked={attributes.value === storedValue}
      value={attributes.value}
    />
  );
}

export const radioBundle: RenderComponentDefinition<RadioAttributes> = {
  Component: Radio,
  nodeType: NodeType.Radio,
  attributeDefinitions,
  allowsChildren: false,
};
