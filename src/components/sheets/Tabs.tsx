import { ActorSheetData } from "controllers/data/ActorSheetData";
import { observer } from "mobx-react-lite";
import React from "react";

function NullTab() {
  return (<></>);
}

function Tab(props: any) {
  const style: any = {};
  if (props.activeTab === props.index) { style.backgroundColor = "lightblue"; }
  return (
    <div style={style} onClick={() => props.setActiveTab(props.index)}>
      {props.name}
    </div>
  );
}

export const SheetTabs = observer((props: any) => {
  const sheetTabs = ActorSheetData.getTabs(props.id) || [];

  // Determines which tabs a user may see
  const viewableTabs: number[] = [];
  for (let i = 0; i < sheetTabs.length || 0; i++) {
    viewableTabs.push(i);
  }

  // Handles case where a user cannot see a given tab
  React.useEffect(() => {
    if (!viewableTabs.includes(props.activeTab)) {
      props.setActiveTab(viewableTabs[0] || 0);
    }
  }, []);

  // Renders no tabs if there is nothing viewable
  if (sheetTabs === undefined || sheetTabs.length <= 1) { return <NullTab/>; }
  const tabs: JSX.Element[] = [];
  for (const viewableTab of viewableTabs) {
    tabs.push(
      <Tab
        key={viewableTab}
        index={viewableTab}
        name={sheetTabs[viewableTab].name}
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
});
