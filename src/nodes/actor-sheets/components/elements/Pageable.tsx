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
  const [ activeTab, setActiveTab ] = React.useState(
    ActorController.getState(props.id, StateType.CurrentPage, props.element.id) as number || 0
  );
  const ref = React.useRef<HTMLDivElement>(null);
  const childElements = props.element.children || [];

  const pages: JSX.Element[] = [];
  let index = 0;
  for (const pageElement of props.element.pages) {
    pages.push(
      <div style={{ display: activeTab === index ? "block" : "none" }}>
        <SheetPage {...props} element={pageElement}/>
      </div>
    );
    index++;
  }

  // Renders all the children that are not part of the pageable pages themself
  const nonPageChildren: JSX.Element[] = [];
  for (const childElement of childElements) {
    nonPageChildren.push(
      <SheetElement key={props.properties.$prefix + childElement.$key} {...props} element={childElement}/>
    );
  }

  // Handles switching between different pages. This roundabout solution is used to minimize the time it takes to
  // render each page by pre-rendering and updating the display style instead of using React to rerender everything
  React.useEffect(() => {
    const newActiveTab = ActorController.getState(props.id, StateType.CurrentPage, props.element.id) as number || 0;
    if (newActiveTab === activeTab) { return; }

    const oldActiveElement = ref.current?.children.item(activeTab);
    const newActiveElement = ref.current?.children.item(newActiveTab);
    if (oldActiveElement) { (oldActiveElement as HTMLElement).style.display = "none"; }
    if (newActiveElement) { (newActiveElement as HTMLElement).style.display = "block"; }

    setActiveTab(newActiveTab);
  }, [ActorController.getState(props.id, StateType.CurrentPage, props.element.id)]);

  return (
    <div>
      <div ref={ref}>
        {pages}
      </div>
      {nonPageChildren}
    </div>
  );
});
