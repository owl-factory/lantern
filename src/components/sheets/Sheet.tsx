import { ActorSheetData } from "controllers/data/ActorSheetData";
import { action, makeObservable, observable } from "mobx";
import { observer } from "mobx-react-lite";
import React from "react";
import { SheetPage } from "./SheetPage";
import { SheetTabs } from "./Tabs";


const Sheet = observer((props: any) => {
  const [ activeTab, setActiveTab ] = React.useState(0);

  React.useEffect(() => {
    ActorSheetData.loadSheet("test", props.xml);
  }, [props.xml]);

  return (
    <div>
      <SheetTabs id="test" activeTab={activeTab} setActiveTab={setActiveTab} />
      <hr/>
      <SheetPage id="test" activeTab={activeTab} />
    </div>
  );
});


export default Sheet;
