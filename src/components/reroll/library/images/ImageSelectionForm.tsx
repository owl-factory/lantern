import { ImageManager } from "client/library";
import { observer } from "mobx-react-lite";
import React from "react";
import { ImageList, LinkImageForm, ListFormat } from "components/reroll/library/images";
import { rest } from "utilities/request";
import { ImageDocument } from "types/documents";

const TABS = [
  "list",
  "link",
  "upload",
];


function SelectionTabs({ useTabs, activeTab, setActiveTab }: any) {
  // TODO - move this out into a design component
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

const ListForm = observer(({imageManager, onSubmit}: any) => {
  return (
    <div>
      <ImageList imageManager={imageManager} listFormat={ListFormat.Icons} onClick={onSubmit}/>
    </div>
  );
});

export const ImageSelectionForm = observer(({user, imageManager, setUser, onSave}: any) => {
  const [activeTab, setActiveTab] = React.useState("list");

  async function onSubmit(image: ImageDocument, method: string): Promise<void> {
    const res = await rest.patch(`/api/profile/image`, { method, image}) as any;
    if (!res.success) { console.log(res.message); return; }
    setUser(res.data.user);
    onSave();
  }

  let activeForm: JSX.Element;
  switch(activeTab) {
    case "link":
      activeForm = <LinkImageForm onSubmit={(image: ImageDocument) => onSubmit(image, "link")}/>;
      break;
    case "list":
      activeForm = (<ListForm
        user={user} 
        imageManager={imageManager} setUser={setUser} onSubmit={(image:ImageDocument) => onSubmit(image, "list")} />);
      break;
    case "upload":
      activeForm = <></>;
      break;
    default:
      activeForm = <></>;
      break;
  }

  return (
    <div>
      <SelectionTabs useTabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab}/>
      <div style={{padding: "1em"}}>
        {activeForm}
      </div>
    </div>
  );
});
