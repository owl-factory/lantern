import { observer } from "mobx-react-lite";
import { ActorController } from "nodes/actor-sheets/controllers/ActorSheetController";
import { StateType } from "nodes/actor-sheets/enums/stateTypes";
import { SheetElementProps } from "nodes/actor-sheets/types";
import { CollapseDescriptor } from "nodes/actor-sheets/types/elements";
import React from "react";
import { SheetChildren } from "./Children";

const VARIABLE_FIELDS = ["id"];

/**
 * Renders an collapse element
 * @param element The collapse element description
 */
export const SheetCollapse = observer((props: SheetElementProps<CollapseDescriptor>) => {
  const [ element, setElement ] = React.useState<any>({});

  React.useEffect(() => {
    ActorController.renderExpressions<CollapseDescriptor>(
      props.renderID,
      props.element,
      VARIABLE_FIELDS,
      props.properties,
    ).then(setElement);
  }, []);

  // Renders nothing if the state is false
  if (!ActorController.getState(props.renderID, StateType.Collapse, element.id)) { return <></>; }

  return (
    <>
      <SheetChildren {...props}/>
    </>
  );
});
