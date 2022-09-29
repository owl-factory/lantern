import { Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { ActorController } from "nodes/actor-sheets/controllers/ActorSheetController";
import { StateType } from "nodes/actor-sheets/enums/stateTypes";
import { SheetElementProps } from "nodes/actor-sheets/types";
import { TabsDescriptor } from "nodes/actor-sheets/types/elements";
import React from "react";

/**
 * A null tab for filling in the blanks when tabs are requested, but cannot be rendered
 */
function NullTab() {
  return (<></>);
}

interface SheetTabProps {
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
function SheetTab(props: SheetTabProps) {
  let activeClass = "";
  const style: any = {};
  if (props.activeTab === props.index) { activeClass = "tab-active"; }
  return (
    <Box className={`tab ${activeClass}`} style={style} onClick={() => props.setActiveTab(props.index)}>
      {props.name}
    </Box>
  );
}

/**
 * Renders all of the tabs for a specific Pageable element
 * @param element The tabs element description
 */
export const SheetTabs = observer((props: SheetElementProps<TabsDescriptor>) => {
  const tabs = ActorController.getTabs(props.renderID, props.element.for) as { name: string }[];

  let activeTab = ActorController.getState(props.renderID, StateType.CurrentPage, props.element.for) || 0;
  if (typeof activeTab === "string") { activeTab = parseInt(activeTab); }
  else if (typeof activeTab !== "number" ) { activeTab = 0; }

  // Renders no tabs if there is nothing viewable
  if (tabs === undefined || tabs.length <= 1) { return <NullTab/>; }

  // Determines which tabs a user may see
  const viewableTabs: number[] = [];
  for (let i = 0; i < tabs.length || 0; i++) {
    viewableTabs.push(i);
  }

  // Sets the active tab state
  function setActiveTab(index: number) {
    ActorController.setState(props.renderID, StateType.CurrentPage, props.element.for, index);
  }

  const tabElements: JSX.Element[] = [];
  for (const viewableTab of viewableTabs) {
    tabElements.push(
      <SheetTab
        key={viewableTab}
        index={viewableTab}
        name={tabs[viewableTab].name}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    );
  }

  return (
    <div>{tabElements}</div>
  );
});
