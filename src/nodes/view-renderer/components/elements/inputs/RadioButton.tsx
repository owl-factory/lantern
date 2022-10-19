import { observer } from "mobx-react-lite";
import { ViewRenderer } from "nodes/view-renderer";
import { RadioDescriptor } from "nodes/view-renderer/types/elements";
import React from "react";
import { SheetElementProps } from "../../../types";

const VARIABLE_FIELDS = ["className", "id", "name", "value"];

/**
 * Renders a radio input element
 * @param element The radio element description
 */
export const SheetRadioButton = observer((props: SheetElementProps<RadioDescriptor>) => {
  const ref = React.createRef<HTMLInputElement>();
  const [ element, setElement ] = React.useState<any>({});

  React.useEffect(() => {
    ViewRenderer.renderExpressions<RadioDescriptor>(
      props,
      VARIABLE_FIELDS,
    ).then(setElement);
  }, []);
  const fieldValue = ViewRenderer.getValue(props, element.name);

  /**
   * Handles the onChange event in the radio buttons. Updates the ActorController values
   * @param ev The triggering onChange event
   */
  function onChange(ev: React.ChangeEvent<HTMLInputElement>) {
    ViewRenderer.setValue(props, element.name, true);
    ev.target.checked = true;
  }

  return (
    <input
      type="radio"
      ref={ref}
      id={element.id}
      name={element.name}
      className={`input radio-button ${element.className}`}
      defaultChecked={fieldValue === element.value}
      onChange={onChange}
      value={element.value}
    />
  );
});
