import React from "react";
import { PageableElement } from "types/layouts/pageableElement";
import { SheetElement } from "../SheetElement";
import { SheetPage } from "./Page";

function NullTab() {
  return (<></>);
}

function SheetTab(props: any) {
  const style: any = {};
  if (props.activeTab === props.index) { style.backgroundColor = "lightblue"; }
  return (
    <div style={style} onClick={() => props.setActiveTab(props.index)}>
      {props.name}
    </div>
  );
}

function SheetTabs(props: any) {
  // Determines which tabs a user may see
  const viewableTabs: number[] = [];
  for (let i = 0; i < props.tabs.length || 0; i++) {
    viewableTabs.push(i);
  }

  // Handles case where a user cannot see a given tab
  React.useEffect(() => {
    if (!viewableTabs.includes(props.activeTab)) {
      props.setActiveTab(viewableTabs[0] || 0);
    }
  }, []);

  // Renders no tabs if there is nothing viewable
  if (props.tabs === undefined || props.tabs.length <= 1) { return <NullTab/>; }

  const tabs: JSX.Element[] = [];
  for (const viewableTab of viewableTabs) {
    tabs.push(
      <SheetTab
        key={viewableTab}
        index={viewableTab}
        name={props.tabs[viewableTab].name}
        activeTab={props.activeTab}
        setActiveTab={props.setActiveTab}
      />
    );
  }

  return (
    <div >
      {tabs}
    </div>
  );
}



interface SheetPageableProps {
  element: PageableElement;
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
    nonPageChildren.push(<SheetElement element={childElement}/>);
  }

  return (
    <div>
      <SheetTabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={props.element.tabs}/>
      <hr/>
      <SheetPage element={props.element.pages[activeTab]}/>
      {nonPageChildren}
    </div>
  );
}
