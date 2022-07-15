import { ActorController } from "../../controllers/ActorController";
import React from "react";
import { SelectElementDescriptor } from "nodes/actor-sheets/types/elements";

const VARIABLE_FIELDS = ["id", "name"];

interface SheetSelectProps {
  id: string;
  element: SelectElementDescriptor;
}

/**
 * Renders a select input element
 * @param element The select element description
 * @todo Implement
 */
export function SheetSelect(props: SheetSelectProps) {
  const element = ActorController.renderVariables<SelectElementDescriptor>(props.id, props.element, VARIABLE_FIELDS);

  return (
    <>
      Select
    </>
  );
}
