import { ImageController } from "client/library";
import { SelectionTabs } from "components/design";
import React from "react";
import { ImageDocument } from "types/documents";
import { LinkImageForm, UploadImageForm } from ".";
import { ImageList, ListFormat } from "..";

const APPROVED_TABS = [ "list", "link", "upload" ];

/**
 * Ensures that all of the tabs are approved.
 * TODO - remove this? We can show a blank tab instead
 * @param requestedTabs The tabs requested to use
 */
function getApprovedTabs(requestedTabs: string[]) {
  const approvedTabs: string[] = [];
  requestedTabs.forEach((requestedTab: string) => {
    if (APPROVED_TABS.includes(requestedTab.toLowerCase())) {
      approvedTabs.push(requestedTab.toLowerCase());
    }
  });

  return approvedTabs;
}

interface ImageFormProps {
  defaultTab: string;
  imageController: ImageController;
  onSubmit: (image: ImageDocument, method: string) => Promise<void>;
  tabs: string[];
}

/**
 * Renders a selection between one of three image forms, either a list, a link form, or an upload form
 * @param defaultTab The default tab to show, if any
 * @param imageController The imagemanager. Not required for all, but should be present
 * @param onSubmit The action to take on submission
 * @param tabs The tabs to show and switch between
 */
export function ImageForm({defaultTab, imageController, onSubmit, tabs}: ImageFormProps) {
  const [ approvedTabs ] = React.useState(getApprovedTabs(tabs));
  const [ activeTab, setActiveTab ] = React.useState(defaultTab || approvedTabs[0]);

  let activeForm: JSX.Element;
  switch(activeTab) {
    case "link":
      activeForm = <LinkImageForm onSubmit={(image: ImageDocument) => onSubmit(image, "link")}/>;
      break;
    case "list":
      activeForm = (
        <ImageList
          imageController={imageController}
          listFormat={ListFormat.Icons}
          onClick={(image:ImageDocument) => onSubmit(image, "list")}
        />
      );
      break;
    case "upload":
      activeForm = <UploadImageForm />;
      break;
    default:
      activeForm = <></>;
      break;
  }

  return (
    <div>
      <SelectionTabs useTabs={approvedTabs} activeTab={activeTab} setActiveTab={setActiveTab}/>
      <div style={{padding: "1em"}}>
        {activeForm}
      </div>
    </div>
  );
}