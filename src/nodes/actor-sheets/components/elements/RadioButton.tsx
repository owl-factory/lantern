import { observer } from "mobx-react-lite";
import React from "react";
import { RadioDescriptor } from "nodes/actor-sheets/types/elements";
import { ActorController } from "../../controllers/ActorSheetController";
import { SheetElementProps } from "../../types";

const VARIABLE_FIELDS = ["id", "name", "value"];

/**
 * Renders a radio input element
 * @param element The radio element description
 */
export const SheetRadioButton = observer((props: SheetElementProps<RadioDescriptor>) => {
  const ref = React.createRef<HTMLInputElement>();
  const [ element, setElement ] = React.useState<any>({});

  React.useEffect(() => {
    ActorController.renderExpressions<RadioDescriptor>(
      props.renderID,
      props.element,
      VARIABLE_FIELDS,
      props.properties,
    ).then(setElement);
  }, []);
  const fieldValue = ActorController.getActor(props.renderID, element.name, props.properties);

  /**
   * Handles the onChange event in the radio buttons. Updates the ActorController values
   * @param ev The triggering onChange event
   */
  function onChange(ev: React.ChangeEvent<HTMLInputElement>) {
    ActorController.setActor(props.renderID, element.name, props.properties, ev.target.value);
    ev.target.checked = true;
  }

  return (
    <input
      type="radio"
      ref={ref}
      id={element.id}
      name={element.name}
      className={`input radio-button`}
      defaultChecked={fieldValue === element.value}
      onChange={onChange}
      value={element.value}
    />
  );
});
