import { observer } from "mobx-react-lite";
import React, { Dispatch } from "react";
import { ImageList, LinkImageForm, ListFormat } from "components/reroll/library/images";
import { rest } from "utilities/request";
import { ImageDocument, UserDocument } from "types/documents";
import { UploadImageForm } from "./forms/UploadImage";
import { ImageManager } from "client/library";
import { ImageForm } from "./forms/ImageForm";

const tabs = [
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

  /**
   * Submits an image selection to the server
   * @param image The new image document to submit
   * @param method The method of selecting a new image
   */
  async function onSubmit(image: ImageDocument, method: string): Promise<void> {
    imageManager.setProfileImage(image, method)
    .then((user: UserDocument) => {
      setUser(user);
      onSave();
    })
    .catch((err: Error) => {
      console.error(err);
    });
  }

  return (
    <ImageForm
      defaultTab="list"
      imageManager={imageManager}
      onSubmit={onSubmit}
      tabs={tabs}
    />
  );
});
