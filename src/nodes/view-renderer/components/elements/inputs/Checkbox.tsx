import { observer } from "mobx-react-lite";
import { ViewRenderer } from "nodes/view-renderer";
import { CheckboxDescriptor } from "nodes/view-renderer/types/elements";
import React from "react";
import { SheetElementProps } from "../../../types";

const VARIABLE_FIELDS = ["className", "id", "name", "value"];

/**
 * Renders a checkbox input element
 * @param element The checkbox element description
 */
export const SheetCheckbox = observer((props: SheetElementProps<CheckboxDescriptor>) => {
  const ref = React.createRef<HTMLInputElement>();
  const [ element, setElement ] = React.useState<any>({});

  React.useEffect(() => {
    ViewRenderer.renderExpressions<CheckboxDescriptor>(
      props,
      VARIABLE_FIELDS,
    ).then(setElement);
  }, []);
  const key = generateCheckboxName(element.name, element.value);
  const checked = !!ViewRenderer.getValue(props, key);

  /**
   * Handles the onChange event in the radio buttons. Updates the ActorController values
   * @param ev The triggering onChange event
   */
  function onChange(ev: React.ChangeEvent<HTMLInputElement>) {
    ViewRenderer.setValue(props, key, ev.target.checked);
    ev.target.checked = !!ViewRenderer.getValue(props, key);
  }

  // Handles the case where we have two or more elements of the same name, and one of them is changed
  // This updates the input values so that we are consistent
  // React.useEffect(() => {
  //   if (!ref.current) { return; }
  //   if (ref.current === document.activeElement) { return; }
  //   ref.current.checked = !!ViewRenderer.getValue(props, key);
  // }, [ViewRenderer.getValue(props, key)]);

  return (
    <input
      type="checkbox"
      id={element.id}
      className={`checkbox ${element.className}`}
      ref={ref}
      defaultChecked={checked}
      name={key}
      onChange={onChange}
    />
  );
});

/**
 * Generates the name of the field that the checkbox input will be saved as, rather than doing multiple layers
 * @param name The name of the checkbox input
 * @param value The value (if any) of the checkbox input
 * @returns The generated name of the checkbox input
 */
function generateCheckboxName(name: string, value?: string) {
  if (name && value) return `${name}/${value}`;
  return `${name}`;
}
