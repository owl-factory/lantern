import { ActorController } from "../../controllers/ActorController";
import React from "react";
import { SelectDescriptor } from "nodes/actor-sheets/types/elements";
import { SheetElementProps } from "nodes/actor-sheets/types";
import { SheetElement } from "../SheetElement";

const VARIABLE_FIELDS = ["id", "name"];

/**
 * Renders a select input element
 * @param element The select element description
 */
export function SheetSelect(props: SheetElementProps<SelectDescriptor>) {
  const element = ActorController.renderVariables<SelectDescriptor>(
    props.id,
    props.element,
    VARIABLE_FIELDS,
    props.properties
  );

  const childElements = props.element.children || [];
  const elements: JSX.Element[] = [];
  for (const childElement of childElements) {
    elements.push(<SheetElement key={props.properties.$prefix + childElement.$key} {...props} element={childElement}/>);
  }

  /**
   * Updates the ActorController to have the changed values
   * @param ev The triggering onChange event
   */
   function onChange(ev: React.ChangeEvent<HTMLSelectElement>) {
    ActorController.updateActorField(props.id, element.name, props.properties, ev.target.value);
    ev.target.value = ActorController.getActorField(props.id, element.name, props.properties).toString();
  }

  return (
    <select
      name={element.name}
      defaultValue={ActorController.getActorField(props.id, element.name, props.properties).toString()}
      onChange={onChange}
    >
      {elements}
    </select>
  );
}
