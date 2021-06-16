import { observer } from "mobx-react-lite";
import React, { Dispatch } from "react";
import { ImageList, LinkImageForm, ListFormat } from "components/reroll/library/images";
import { rest } from "utilities/request";
import { ImageDocument, UserDocument } from "types/documents";
import { UploadImageForm } from "./forms/UploadImage";
import { SelectionTabs } from "components/design";
import { ImageManager } from "client/library";

const TABS = [
  "list",
  "link",
  "upload",
];

interface ImageSelectionFormProps {
  imageManager: ImageManager;
  setUser: Dispatch<UserDocument>;
  onSave: () => void;
}

/**
 * Renders a form to select an image
 * @param imageManager The image manager containing and managing all of the images
 * @param setUser The function to update the user when a new profile image is selected
 * @param onSave The function to run after the profile image is changed
 */
export const ImageSelectionForm = observer(({imageManager, setUser, onSave}: ImageSelectionFormProps) => {
  const [activeTab, setActiveTab] = React.useState("list");

  /**
   * Submits an image selection to the server
   * @param image The new image document to submit
   * @param method The method of selecting a new image
   */
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
      activeForm = (
        <ImageList
          imageManager={imageManager}
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
      <SelectionTabs useTabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab}/>
      <div style={{padding: "1em"}}>
        {activeForm}
      </div>
    </div>
  );
});
