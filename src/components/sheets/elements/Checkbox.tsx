import { ActorController } from "controllers/actor/ActorController";
import { observer } from "mobx-react-lite";
import React from "react";
import { CheckboxElementDescriptor } from "types/sheetElementDescriptors";

const VARIABLE_FIELDS = ["id", "name", "value"];

interface SheetCheckboxProps {
  id: string;
  element: CheckboxElementDescriptor;
}

/**
 * Renders a checkbox input element
 * @param element The checkbox element description
 */
export const SheetCheckbox = observer((props: SheetCheckboxProps) => {
  const ref = React.createRef<HTMLInputElement>();

  const element = ActorController.parseVariables<CheckboxElementDescriptor>(props.id, props.element, VARIABLE_FIELDS);
  const key = generateCheckboxName(element.name, element.value);
  const checked = ActorController.getActorField(props.id, key);

  /**
   * Handles the onChange event in the radio buttons. Updates the ActorController values
   * @param ev The triggering onChange event
   */
  function onChange(ev: React.ChangeEvent<HTMLInputElement>) {
    ActorController.setActorField(props.id, key, ev.target.checked);
    ev.target.checked = ActorController.getActorField(props.id, key);
  }

  // Handles the case where we have two or more elements of the same name, and one of them is changed
  // This updates the input values so that we are consistent
  React.useEffect(() => {
    if (!ref.current) { return; }
    if (ref.current === document.activeElement) { return; }
    ref.current.checked = ActorController.getActorField(props.id, key);
  }, [ActorController.getActorField(props.id, key)]);

  return (
    <input
      type="checkbox"
      id={element.id}
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
