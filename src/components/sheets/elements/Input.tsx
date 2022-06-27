import { ActorController } from "controllers/actor/ActorController";
import { observer } from "mobx-react-lite";
import React from "react";
import { NumberInputElementDescriptor, TextInputElementDescriptor } from "types/sheetElementDescriptors";
import style from "../styling/Input.module.scss";

const VARIABLE_FIELDS = ["id", "name"];

interface IndividualSheetInputProps {
  id: string;
  element: NumberInputElementDescriptor | TextInputElementDescriptor;
}

interface SheetInputProps extends IndividualSheetInputProps {
  type: string;
}

/**
 * Renders a text input element
 * @param id The id of the render this sheet is using
 * @param element The text input element description
 * @param type The type of the input (number or text)
 */
const SheetInput = observer((props: SheetInputProps) => {
  const ref = React.createRef<HTMLInputElement>();
  const element = ActorController.parseVariables<TextInputElementDescriptor>(props.id, props.element, VARIABLE_FIELDS);

  /**
   * Updates the ActorController to have the changed values
   * @param ev The triggering onChange event
   */
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    ActorController.setActorField(props.id, props.element.name, e.target.value);
    e.target.value = ActorController.getActorField(props.id, props.element.name);
  }

  // Handles the case where we have two or more elements of the same name, and one of them is changed
  // This updates the input values so that we are consistent
  React.useEffect(() => {
    if (!ref.current) { return; }
    if (ref.current === document.activeElement) { return; }
    ref.current.value = ActorController.getActorField(props.id, props.element.name);
  }, [ActorController.getActorField(props.id, props.element.name)]);

  return (
    <div>
      <input
        ref={ref}
        id={element.id}
        type={props.type}
        name={element.name}
        className={`${style.actorSheetInput}`}
        onChange={onChange}
        autoComplete="off"
        defaultValue={ActorController.getActorField(props.id, element.name)}
      />
    </div>
  );
});

/**
 * Renders a number input element
 * @param id The id of the render this sheet is using
 * @param element The text input element description
 */
export function SheetNumberInput(props: IndividualSheetInputProps) {
  return <SheetInput {...props} type="number"/>;
}

/**
 * Renders a text input element
 * @param id The id of the render this sheet is using
 * @param element The text input element description
 */
export function SheetTextInput(props: IndividualSheetInputProps) {
  return <SheetInput {...props} type="text"/>;
}
