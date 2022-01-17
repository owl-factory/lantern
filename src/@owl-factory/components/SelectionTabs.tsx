import React, { Dispatch } from "react";

interface SelectionTabsProps {
  activeTab: string;
  setActiveTab: Dispatch<string>;
  useTabs: string[];
}

/**
 * Renders tabs for selecting different views
 * @param activeTab The currently active tab
 * @param setActiveTab The function to set a newly active tab
 * @param useTabs The tabs to render in the order they ought to appear
 */
export function SelectionTabs({ activeTab, setActiveTab, useTabs }: SelectionTabsProps): JSX.Element {
  const tabs: JSX.Element[] = [];
  useTabs.forEach((useTab: string) => {
    const readableTab = useTab.charAt(0).toUpperCase() + useTab.slice(1);
    tabs.push(
      <li key={useTab} className={`nav-item`}>
        <a
          className={`nav-link ${useTab === activeTab ? "active" : ""}`}
          onClick={() => setActiveTab(useTab)}
        >
          {readableTab}
        </a>
      </li>
    );
  });

  return (
    <ul className={`nav nav-tabs`}>
      {tabs}
    </ul>
  );
}
