import React from "react";
import { PageableElementDescriptor } from "types/sheetElementDescriptors";
import { SheetElement } from "../SheetElement";
import { SheetPage } from "./Page";
import { SheetTabs } from "./Tabs";


interface SheetPageableProps {
  id: string;
  element: PageableElementDescriptor;
}

/**
 * Renders an image of the background
 * @param element The SheetBackground element description
 */
export function SheetPageable(props: SheetPageableProps) {
  const [ activeTab, setActiveTab ] = React.useState(0);
  const childElements = props.element.children || [];

  // Renders all the children that are not part of the pageable pages themself
  const nonPageChildren: JSX.Element[] = [];
  for (const childElement of childElements) {
    nonPageChildren.push(<SheetElement key={Math.random()} id={props.id} element={childElement}/>);
  }

  return (
    <div>
      <SheetTabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={props.element.tabs}/>
      <hr/>
      <SheetPage id={props.id} element={props.element.pages[activeTab]}/>
      {nonPageChildren}
    </div>
  );
}
