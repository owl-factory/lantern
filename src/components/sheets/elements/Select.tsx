import { ActorController } from "controllers/actor/ActorController";
import React from "react";
import { SelectElementDescriptor } from "types/sheetElementDescriptors";
import { SheetElementProps } from "../types";

const VARIABLE_FIELDS = ["id", "name"];

/**
 * Renders a select input element
 * @param element The select element description
 * @todo Implement
 */
export function SheetSelect(props: SheetElementProps<SelectElementDescriptor>) {
  const element = ActorController.renderVariables<SelectElementDescriptor>(props.id, props.element, VARIABLE_FIELDS);

  return (
    <>
      Select
    </>
  );
}
