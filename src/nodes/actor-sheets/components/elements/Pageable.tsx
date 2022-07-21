import React from "react";
import { PageableDescriptor } from "nodes/actor-sheets/types/elements";
import { SheetElement } from "../SheetElement";
import { SheetElementProps } from "../../types";
import { SheetPage } from "./Page";
import { StateType } from "nodes/actor-sheets/enums/stateTypes";
import { ActorController } from "nodes/actor-sheets/controllers/ActorController";
import { observer } from "mobx-react-lite";

/**
 * Renders an image of the background
 * @param element The SheetBackground element description
 */
export const SheetPageable = observer((props: SheetElementProps<PageableDescriptor>) => {
  const activeTab = ActorController.getState(props.id, StateType.CurrentPage, props.element.id) as number || 0;
  const childElements = props.element.children || [];

  // Renders all the children that are not part of the pageable pages themself
  const nonPageChildren: JSX.Element[] = [];
  for (const childElement of childElements) {
    nonPageChildren.push(
      <SheetElement key={props.properties.$prefix + childElement.$key} {...props} element={childElement}/>
    );
  }

  return (
    <div>
      <SheetPage {...props} element={props.element.pages[activeTab]}/>
      {nonPageChildren}
    </div>
  );
});
