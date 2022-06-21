
import { SheetTabElementDescriptor } from "controllers/actor/ActorSheetController";
import React from "react";

/**
 * A null tab for filling in the blanks when tabs are requested, but cannot be rendered
 */
function NullTab() {
  return (<></>);
}

interface SheetTapProps {
  activeTab: number;
  setActiveTab: (activeTab: number) => void;
  name: string;
  index: number;
}

/**
 * Renders a single tab
 * @param activeTab The currently active tab index
 * @param setActiveTab A function that sets the currently active tab
 * @param name The name of the page to render within the tab
 * @param index The current tab's index
 */
function SheetTab(props: SheetTapProps) {
  const style: any = {};
  if (props.activeTab === props.index) { style.backgroundColor = "lightblue"; }
  return (
    <div style={style} onClick={() => props.setActiveTab(props.index)}>
      {props.name}
    </div>
  );
}

interface SheetTabsProps {
  tabs: SheetTabElementDescriptor[];
  activeTab: number;
  setActiveTab: (activeTab: number) => void;
}

/**
 * Renders all of the tabs for a given Pageable element
 * @param tabs An array decribing each tab
 * @param activeTab The index of the currently active tab
 * @param setActiveTab A function the set the currently active tab
 */
export function SheetTabs(props: SheetTabsProps) {
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
