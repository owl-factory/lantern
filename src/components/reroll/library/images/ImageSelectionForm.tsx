import { ImageManager } from "client/library";
import { observer } from "mobx-react-lite";
import React from "react";
import { ImageList, ListFormat } from "components/reroll/library/images";
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

const ListForm = observer(({activeTab, imageManager, setUser, onSave}: any) => {
  
  if (activeTab !== "list") { return null; }

  async function updateUserImage(image: ImageDocument) {
    const res = await rest.patch(`/api/profile/image`, { method: "list", imageID: image.id}) as any;
    console.log(res); 
    if (!res.success) { console.log(res.message); return; }
    console.log(res.data.user)
    setUser(res.data.user);
    onSave();
  }

  return (
    <div>
      <ImageList imageManager={imageManager} listFormat={ListFormat.Icons} onClick={updateUserImage}/>
    </div>
  );
});

export const ImageSelectionForm = observer(({user, imageManager, setUser, onSave}: any) => {
  const [activeTab, setActiveTab] = React.useState("list");

  return (
    <div>
      <SelectionTabs useTabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab}/>
      <div style={{padding: "1em"}}>
        <ListForm activeTab={activeTab} user={user} imageManager={imageManager} setUser={setUser} onSave={onSave} />
      </div>
    </div>
  );
});
