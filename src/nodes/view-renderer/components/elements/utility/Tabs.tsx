import { observer } from "mobx-react-lite";
import { ActiveData } from "nodes/active-data";
import { ViewRenderer } from "nodes/view-renderer";
import { TabsAttributes } from "nodes/view-renderer/types/attributes";
import { RenderProps } from "nodes/view-renderer/types/renderProps";
import { fetchExpressionValues, runExpression } from "nodes/view-renderer/utilities/render/expression";
import React from "react";

/**
 * A null tab for filling in the blanks when tabs are requested, but cannot be rendered
 */
 function NullTab() {
  return (<div className="tabs"></div>);
}

/**
 * Renders a tabs list for use within a View
 * @param renderID The ID of the render that this View element uses
 * @param element The element descriptor that defines this element
 * @param properties Any current render state
 */
 export const ViewTabs = observer((props: RenderProps<TabsAttributes>) => {
  const render = ViewRenderer.renders[props.renderID];
  const view = ViewRenderer.views[render.viewID || ""];
  if (!render || !view) { return <NullTab/>; }

  const sources = render.sources;
  const tabs = view.pageGroups//ActorController.getTabs(props.renderID, props.element.for) as { name: string }[];

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
    <div className={`tabs ${element.className}`}>{tabElements}</div>
  );
});
