import { ActorController } from "controllers/actor/ActorController";
import { useField } from "formik";
import React from "react";
import { TextAreaElementDescriptor } from "types/sheetElementDescriptors";
import style from "../styling/Input.module.scss";

interface SheetTextAreaProps {
  id: string;
  element: TextAreaElementDescriptor;
}

/**
 * Renders a text area input element
 * @param element The text area element description
 */
export function SheetTextArea(props: SheetTextAreaProps) {
  const ref = React.createRef<HTMLTextAreaElement>();

  /**
   * Updates the ActorController to have the changed values
   * @param ev The triggering onChange event
   */
  function onChange(ev: React.ChangeEvent<HTMLTextAreaElement>) {
    ActorController.setActorField(props.id, props.element.name, ev.target.value);
    ev.target.value = ActorController.getActorField(props.id, props.element.name);
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
      <textarea
        ref={ref}
        id={props.element.id}
        name={props.element.name}
        onChange={onChange}
        className={`${style.actorSheetInput}`}
        rows={4}
        defaultValue={ActorController.getActorField(props.id, props.element.name)}
      />
    </div>
  );
}
