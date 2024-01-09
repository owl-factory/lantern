import { StateContext } from "features/dynamicRender/context/stateContext";
import { tabsAttributes } from "features/dynamicRender/data/attributes/utility/tabs";
import { useAttributes } from "features/dynamicRender/hooks/useAttributes";
import { TabsAttributes } from "features/dynamicRender/types/attributes/utilities/tabs";
import { RenderComponentProps } from "features/dynamicRender/types/render";
import { Page, StateController } from "features/dynamicRender/utils/stateController";
import { useContext } from "react";

/**
 * Renders a group of tabs that can be used to select the page to show
 */
export function Tabs(props: RenderComponentProps) {
  const { attributes } = useAttributes<TabsAttributes>(props.node, tabsAttributes);
  const state = useContext(StateContext);

  if (!attributes.for) {
    return <></>;
  }

  const activeTab = state.getActivePage(attributes.for);
  const tabs = state
    .getPages(attributes.for)
    .map((page: Page) => (
      <Tab key={page.key} page={page} groupKey={attributes.for} active={page.key === activeTab} state={state} />
    ));

  return <div>{tabs}</div>;
}

type TabProps = {
  page: Page;
  groupKey: string;
  active: boolean;
  state: StateController;
};

const ENFORCED_CLASSES = "cursor-pointer";

/**
 * Renders out a tab for the Dynamic Render system for navigation between pages
 * @param page - An object describing a page within the state
 * @param groupKey - The identifying key for the group that this tab belongs to
 * @param active - If this tab is currently active
 * @param state - The state controller
 * @returns A Tab JSX.Element
 */
function Tab(props: TabProps) {
  const activeClass = props.active ? "font-bold" : "";
  return (
    <div
      className={`${ENFORCED_CLASSES} ${activeClass}`}
      onClick={() => props.state.setActivePage(props.groupKey, props.page.key)}
    >
      {props.page.name}
    </div>
  );
}
