import React from "react";
import { FileDocument } from "types/documents";
import { AssetUploadSource } from "types/enums/files/createMethod";
import { LinkImageForm, UploadImageForm } from ".";
import { ImageList, ListFormat } from "..";
import { SelectionTabs } from "components/SelectionTabs";

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
  onSubmit: (image: Partial<FileDocument>, method: AssetUploadSource) => Promise<void>;
  tabs: string[];
}

/**
 * Renders a selection between one of three image forms, either a list, a link form, or an upload form
 * @param defaultTab The default tab to show, if any
 * @param onSubmit The action to take on submission
 * @param tabs The tabs to show and switch between
 */
export function ImageForm({defaultTab, onSubmit, tabs}: ImageFormProps) {
  const [ approvedTabs ] = React.useState(getApprovedTabs(tabs));
  const [ activeTab, setActiveTab ] = React.useState(defaultTab || approvedTabs[0]);

  let activeForm: JSX.Element;
  switch(activeTab) {
    case "link":
      activeForm = (
        <LinkImageForm onSubmit={(image: Partial<FileDocument>) => onSubmit(image, AssetUploadSource.ExternalLink)}/>
      );
      break;
    case "list":
      activeForm = (
        <ImageList
          listFormat={ListFormat.Icons}
          onClick={(image:Partial<FileDocument>) => onSubmit(image, AssetUploadSource.Select)}
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
