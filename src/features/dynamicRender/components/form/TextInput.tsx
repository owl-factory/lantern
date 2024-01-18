import { textInputAttributes } from "features/dynamicRender/data/attributes/form/textInput";
import { useAttributes } from "features/dynamicRender/hooks/useAttributes";
import { useFormValue } from "features/dynamicRender/hooks/useFormValue";
import { TextInputAttributes } from "features/dynamicRender/types/attributes/form/textInput";
import { NodeType } from "features/dynamicRender/types/node";
import { GetOptions } from "features/dynamicRender/types/query";
import { RenderComponentDefinition, RenderComponentProps } from "features/dynamicRender/types/render";
import { buildQueryOptionsFromAttributes } from "features/dynamicRender/utils/query";
import { ChangeEvent, useMemo } from "react";

/**
 * Renders a text input for the Dynamic Render
 */
export function TextInput(props: RenderComponentProps) {
  const { attributes } = useAttributes<TextInputAttributes>(props.node, textInputAttributes);
  const options = useMemo<GetOptions>(() => buildQueryOptionsFromAttributes(attributes), [attributes]);
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

export const textInputBundle: RenderComponentDefinition = {
  Component: TextInput,
  nodeType: NodeType.TextInput,
  attributes: textInputAttributes,
  allowsChildren: false,
};
