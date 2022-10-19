import { observer } from "mobx-react-lite";
import { ViewRenderer } from "nodes/view-renderer";
import { StateType } from "nodes/view-renderer/enums/stateTypes";
import { SheetElementProps } from "nodes/view-renderer/types";
import { CollapseDescriptor } from "nodes/view-renderer/types/elements";
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
    ViewRenderer.renderExpressions<CollapseDescriptor>(
      props,
      VARIABLE_FIELDS,
    ).then(setElement);
  }, []);

  // Renders nothing if the state is false
  // if (!ActorController.getState(props.renderID, StateType.Collapse, element.id)) { return <></>; }

  return (
    <>
      <SheetChildren {...props}/>
    </>
  );
});
