import { observer } from "mobx-react-lite";
import { ActorController } from "nodes/actor-sheets/controllers/ActorController";
import { StateType } from "nodes/actor-sheets/enums/stateTypes";
import { SheetElementProps } from "nodes/actor-sheets/types";
import { CollapseDescriptor } from "nodes/actor-sheets/types/elements";
import React from "react";
import { SheetElement } from "../SheetElement";

const VARIABLE_FIELDS = ["id"];

/**
 * Renders an collapse element
 * @param element The collapse element description
 */
export const SheetCollapse = observer((props: SheetElementProps<CollapseDescriptor>) => {
  const element = ActorController.renderVariables<CollapseDescriptor>(
    props.id,
    props.element,
    VARIABLE_FIELDS,
    props.properties,
  );

  // Renders nothing if the state is false
  if (!ActorController.getState(props.id, StateType.Collapse, element.id)) { return <></>; }

  const childElements = props.element.children || [];
  const elements: JSX.Element[] = [];
  for (const childElement of childElements) {
    elements.push(<SheetElement key={props.properties.$prefix + childElement.$key} {...props} element={childElement}/>);
  }

  return (
    <>
      {elements}
    </>
  );
});
