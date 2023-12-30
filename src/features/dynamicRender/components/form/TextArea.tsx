import { useFormValue } from "features/dynamicRender/hooks/useFormValue";
import { GetOptions } from "features/dynamicRender/types/query";
import { RenderComponentProps } from "features/dynamicRender/types/render";
import { buildQueryOptions } from "features/dynamicRender/utils/query";
import { ChangeEvent, useMemo } from "react";

/**
 * Renders a text input for the Dynamic Render
 */
export function TextArea(props: RenderComponentProps) {
  const options = useMemo<GetOptions>(() => buildQueryOptions(props.node), [props.node]);
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
