import { ActorController } from "../../controllers/ActorController";
import React from "react";
import { SelectElementDescriptor } from "nodes/actor-sheets/types/elements";
import { SheetElementProps } from "nodes/actor-sheets/types";

const VARIABLE_FIELDS = ["id", "name"];

/**
 * Renders a select input element
 * @param element The select element description
 * @todo Implement
 */
export function SheetSelect(props: SheetElementProps<SelectElementDescriptor>) {
  const element = ActorController.renderVariables<SelectElementDescriptor>(
    props.id,
    props.element,
    VARIABLE_FIELDS,
    props.properties
  );

  return (
    <>
      Select
    </>
  );
}
