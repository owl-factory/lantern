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

export type TextAreaAttributes = CommonInputAttributes;
export const attributeDefinitions: AttributeDefinition[] = [...COMMON_INPUT_ATTRIBUTE_DEFINITIONS];

/**
 * Renders a text input for the Dynamic Render
 */
export function TextArea(props: RenderComponentProps<TextAreaAttributes>) {
  const { attributes } = useAttributes<TextAreaAttributes>(props.node, attributeDefinitions);
  const options = useMemo<GetOptions>(
    () => buildQueryOptionsFromAttributes(attributes),
    [attributes]
  );
  const { value, update } = useFormValue(options, "");

  /**
   * Updates the form value on change.
   * @param e - The triggering change event
   */
  function onChange(e: ChangeEvent<HTMLTextAreaElement>) {
    if (!e || !e.target) return;
    update(e.target.value);
  }

  return <textarea onChange={onChange} value={value} />;
}

export const textAreaBundle: RenderComponentDefinition<TextAreaAttributes> = {
  Component: TextArea,
  nodeType: NodeType.TextArea,
  attributeDefinitions,
  allowsChildren: false,
};
