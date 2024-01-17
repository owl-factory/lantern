import { textAreaAttributes } from "features/dynamicRender/data/attributes/form/textArea";
import { useAttributes } from "features/dynamicRender/hooks/useAttributes";
import { useFormValue } from "features/dynamicRender/hooks/useFormValue";
import { TextAreaAttributes } from "features/dynamicRender/types/attributes/form/textArea";
import { NodeType } from "features/dynamicRender/types/node";
import { GetOptions } from "features/dynamicRender/types/query";
import { RenderComponentDefinition, RenderComponentProps } from "features/dynamicRender/types/render";
import { buildQueryOptionsFromAttributes } from "features/dynamicRender/utils/query";
import { ChangeEvent, useMemo } from "react";

/**
 * Renders a text input for the Dynamic Render
 */
export function TextArea(props: RenderComponentProps) {
  const { attributes } = useAttributes<TextAreaAttributes>(props.node, textAreaAttributes);
  const options = useMemo<GetOptions>(() => buildQueryOptionsFromAttributes(attributes), [attributes]);
  const { value, update } = useFormValue<string>(options, "");

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

export const textAreaBundle: RenderComponentDefinition = {
  Component: TextArea,
  nodeType: NodeType.TextArea,
  attributes: textAreaAttributes,
  allowsChildren: false,
};
