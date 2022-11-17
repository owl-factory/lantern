import { Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { ViewRenderer } from "nodes/view-renderer";
import { StateType } from "nodes/view-renderer/enums/stateType";
import { TabsAttributes } from "nodes/view-renderer/types/attributes";
import { RenderProps } from "nodes/view-renderer/types/renderProps";
import { fetchExpressionValues, runExpression } from "nodes/view-renderer/utilities/render/expression";
import React from "react";


interface ViewTabProps {
  activePage: number;
  setActivePage: (activeTab: number) => void;
  name: string;
  index: number;
}

/**
 * A null tab for filling in the blanks when tabs are requested, but cannot be rendered
 */
 function NullTab() {
  return (<div className="tabs"></div>);
}

/**
 * Renders a single tab
 * @param activeTab The currently active tab index
 * @param setActiveTab A function that sets the currently active tab
 * @param name The name of the page to render within the tab
 * @param index The current tab's index
 */
function ViewTab(props: ViewTabProps) {
  let activeClass = "";
  const style: any = {};
  if (props.activePage === props.index) { activeClass = "tab-active"; }
  return (
    <Box className={`tab ${activeClass}`} style={style} onClick={() => props.setActivePage(props.index)}>
      {props.name}
    </Box>
  );
}

/**
 * Renders a tabs list for use within a View
 * @param renderID The ID of the render that this View element uses
 * @param element The element descriptor that defines this element
 * @param properties Any current render state
 */
 export const ViewTabs = observer((props: RenderProps<TabsAttributes>) => {
  const sources = ViewRenderer.renders[props.renderID].sources;
  const pages = ViewRenderer.getPages(props.renderID, props.element.attributes.for);
  const activePage = ViewRenderer.getState<number>(props.renderID, StateType.CurrentPage, props.element.attributes.for)

  const [ className, setClassName ] = React.useState("");

  // Class Name
  React.useEffect(() => {
    runExpression(sources, props.element.attributes.className, props.properties).then((res: string) => {
      setClassName(res);
    });
  }, fetchExpressionValues(sources, props.element.attributes.className) as unknown[]);

  // Renders no tabs if there is nothing viewable
  if (pages === undefined || pages.length <= 1) { return <NullTab/>; }

  // Determines which tabs a user may see
  const viewablePages: number[] = [];
  for (let i = 0; i < pages.length || 0; i++) {
    viewablePages.push(i);
  }

  /**
   * Sets the new active page for this group of pages and tabs
   * @param index The index of the new page to use
   */
  function setActivePage(index: number) {
    ViewRenderer.setState(props.renderID, StateType.CurrentPage, props.element.attributes.for, index);
  }

  const tabElements: JSX.Element[] = [];
  for (const viewablePage of viewablePages) {
    tabElements.push(
      <ViewTab
        key={`${props.properties.$prefix}_tab-${viewablePage}`}
        index={viewablePage}
        name={pages[viewablePage].name}
        activePage={activePage}
        setActivePage={setActivePage}
      />
    );
  }

  return (
    <div className={`tabs ${className}`}>{tabElements}</div>
  );
});
