import { numberInputAttributes } from "features/dynamicRender/data/attributes/form/numberInput";
import { useAttributes } from "features/dynamicRender/hooks/useAttributes";
import { useFormValue } from "features/dynamicRender/hooks/useFormValue";
import { NumberInputAttributes } from "features/dynamicRender/types/attributes/form/numberInput";
import { NodeType } from "features/dynamicRender/types/node";
import { GetOptions } from "features/dynamicRender/types/query";
import {
  RenderComponentDefinition,
  RenderComponentProps,
} from "features/dynamicRender/types/render";
import { buildQueryOptionsFromAttributes } from "features/dynamicRender/utils/query";
import { ChangeEvent, useMemo } from "react";

/**
 * Renders a number input for the Dynamic Render
 */
export function NumberInput(props: RenderComponentProps) {
  const { attributes } = useAttributes<NumberInputAttributes>(props.node, numberInputAttributes);
  const options = useMemo<GetOptions>(
    () => buildQueryOptionsFromAttributes(attributes),
    [attributes]
  );
  const { value, update } = useFormValue(options, "");

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

export const numberInputBundle: RenderComponentDefinition = {
  Component: NumberInput,
  nodeType: NodeType.NumberInput,
  attributes: numberInputAttributes,
  allowsChildren: false,
};
