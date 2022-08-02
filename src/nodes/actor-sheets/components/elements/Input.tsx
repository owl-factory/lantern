import { observer } from "mobx-react-lite";
import React from "react";
import { NumberInputDescriptor, TextInputDescriptor } from "nodes/actor-sheets/types/elements";
import style from "../../styles/Input.module.scss";
import { SheetElementProps } from "../../types";
import { ActorController } from "../../controllers/ActorSheetController";

const VARIABLE_FIELDS = ["id", "name"];

type IndividualSheetInputProps = SheetElementProps<NumberInputDescriptor | TextInputDescriptor>

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
  const element = ActorController.renderExpressions<TextInputDescriptor>(
    props.renderID,
    props.$key,
    props.element,
    VARIABLE_FIELDS,
    props.properties,
  );

  /**
   * Updates the ActorController to have the changed values
   * @param ev The triggering onChange event
   */
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    ActorController.setActor(props.renderID, element.name, props.properties, e.target.value);
    e.target.value = ActorController.getActor(props.renderID, element.name, props.properties).toString();
  }

  // Handles the case where we have two or more elements of the same name, and one of them is changed
  // This updates the input values so that we are consistent
  React.useEffect(() => {
    if (!ref.current) { return; }
    if (ref.current === document.activeElement) { return; }
    ref.current.value = ActorController.getActor(props.renderID, element.name, props.properties).toString();
  }, [ActorController.getActor(props.renderID, element.name, props.properties)]);

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
        defaultValue={ActorController.getActor(props.renderID, element.name, props.properties).toString()}
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
