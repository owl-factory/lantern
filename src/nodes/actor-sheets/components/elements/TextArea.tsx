import React from "react";
import { TextAreaDescriptor } from "nodes/actor-sheets/types/elements";
import style from "../../styles/Input.module.scss";
import { SheetElementProps } from "../../types";
import { ActorController } from "../../controllers/ActorSheetController";

const VARIABLE_FIELDS = ["id", "name"];

/**
 * Renders a text area input element
 * @param element The text area element description
 */
export function SheetTextArea(props: SheetElementProps<TextAreaDescriptor>) {
  const ref = React.createRef<HTMLTextAreaElement>();
  const element = ActorController.renderExpressions<TextAreaDescriptor>(
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
  function onChange(ev: React.ChangeEvent<HTMLTextAreaElement>) {
    ActorController.setActor(props.renderID, element.name, props.properties, ev.target.value);
    ev.target.value = ActorController.getActor(props.renderID, element.name, props.properties).toString();
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
      <textarea
        ref={ref}
        id={element.id}
        name={element.name}
        onChange={onChange}
        className={`${style.actorSheetInput}`}
        rows={4}
        defaultValue={ActorController.getActor(props.renderID, element.name, props.properties).toString()}
      />
    </div>
  );
}
